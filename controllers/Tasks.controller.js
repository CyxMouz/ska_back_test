const Task = require("../models/Tasks.model");
const User = require("../models/User.model");
const moment = require("moment");

exports.addTask = async (req, res) => {
  try {
    const { name, description } = req.body;

    const newTask = new Task({
      name,
      description,
      user: req.userId,
    });
    await newTask.save();

    res.status(201).json({ message: "Task added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.userId });
    res.status(200).json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.markTaskAsComplete = async (req, res) => {
  try {
    const taskId = req.params.id;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    task.status = "completed";
    (task.completionDate = new Date().toISOString().split("T")[0]),
      await task.save();

    return res.status(200).json(task);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.countTask = async (req, res) => {
  try {
    const userId = req.userId;

    const completedTasksCount = await Task.countDocuments({
      user: userId,
      status: "completed",
    });
    const pendingTasksCount = await Task.countDocuments({
      user: userId,
      status: "pending",
    });

    return res.status(200).json({
      completedTasksCount,
      pendingTasksCount,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
exports.countTasksAdmin = async (req, res) => {
  try {
    const users = await User.find();

    const userTaskCounts = {};

    for (const user of users) {
      const userId = user._id;
      const completedTasksCount = await Task.countDocuments({
        user: userId,
        status: "completed",
      });
      const pendingTasksCount = await Task.countDocuments({
        user: userId,
        status: "pending",
      });

      userTaskCounts[userId] = {
        completedTasksCount,
        pendingTasksCount,
      };
    }

    return res.status(200).json(userTaskCounts);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
exports.getTasksByDate = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const completedTasksCountByDate = await Task.aggregate([
      {
        $match: {
          user: user._id,
          status: "completed",
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: { $toDate: "$completionDate" },
            },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
    ]);

    res.status(200).json(completedTasksCountByDate);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getTasksInDateRange = async (req, res) => {
  console.log(req.query);
  const { dateDebut, dateFin } = req.query;
  const userId = req.userId;

  try {
    const user = await User.findById(userId);
    if (
      !moment(dateDebut, moment.ISO_8601, true).isValid() ||
      !moment(dateFin, moment.ISO_8601, true).isValid()
    ) {
      return res.status(400).json({ message: "Invalid date format" });
    }

    const tasks = await Task.find({
      user: user._id,
      status: "completed",
      completionDate: { $gte: new Date(dateDebut), $lte: new Date(dateFin) },
    });

    return res.status(200).json(tasks.length);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getTasksRate = async (req, res) => {
  const { startDate, endDate } = req.body;

  try {
    const user = await User.findById(req.userId);
    if (
      !moment(startDate, moment.ISO_8601, true).isValid() ||
      !moment(endDate, moment.ISO_8601, true).isValid()
    ) {
      return res.status(400).json({ message: "Invalid date format" });
    }
    const tasksCompleted = await Task.countDocuments({
      user: user._id,
      status: "completed",
      completionDate: { $gte: new Date(startDate), $lte: new Date(endDate) },
    });
    const TotalTasks = await Task.countDocuments({
      user: user._id,
      completionDate: { $gte: new Date(startDate), $lte: new Date(endDate) },
    });
    console.log(tasksCompleted);
    console.log(TotalTasks);
    return res.status(200).json({ data: tasksCompleted / TotalTasks });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
// exports.getTasksRateByMonth = async (req, res) => {
//   const userId = req.userId;
//   try {
//     //const { user } = req.body;
//     const user = await User.findById("65ae228928f5e86d3b447ac1");
//     const currentMonth = moment().month() + 1;
//     const currentYear = moment().year();

//     const startOfMonth = moment({ year: currentYear, month: currentMonth - 1 })
//       .startOf("month")
//       .toDate();
//     const endOfMonth = moment({ year: currentYear, month: currentMonth - 1 })
//       .endOf("month")
//       .toDate();

//     const currentMonthTasks = await Task.find({
//       user: user._id,
//       status: "completed",
//       completionDate: { $gte: startOfMonth, $lte: endOfMonth },
//     });

//     const currentMonthCompletionRate =
//       calculateCompletionRate(currentMonthTasks);

//     const completionRates = [];
//     for (let i = 0; i < 12; i++) {
//       const startDate = moment({
//         year: currentYear,
//         month: currentMonth - i - 1,
//       })
//         .startOf("month")
//         .toDate();
//       const endDate = moment({ year: currentYear, month: currentMonth - i - 1 })
//         .endOf("month")
//         .toDate();

//       const tasks = await Task.find({
//         user: user._id,
//         status: "completed",
//         completionDate: { $gte: startDate, $lte: endDate },
//       });
//       const completionRate = calculateCompletionRate(tasks);

//       console.log("completion rate", completionRates);

//       completionRates.push({
//         month: moment(startDate),
//         completionRate,
//       });
//     }
//     console.log("completion rate", completionRates);
//     return res
//       .status(200)
//       .json({ currentMonthCompletionRate, completionRates });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: "Internal Server Error" });
//   }
// };

// const calculateCompletionRate = (tasks) => {
//   const totalTasks = tasks.length;
//   const completedTasks = tasks.filter(
//     (task) => task.status === "completed"
//   ).length;

//   return totalTasks === 0 ? 0 : (completedTasks / totalTasks) * 100;
// };
