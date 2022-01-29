const Employee = require("../models/Employee");
const { Validator } = require("node-input-validator");
const mongoose = require("mongoose");

const EmployeeList = async (req, res, next) => {
  try {
    console.log(req.query);
    let query = [];
    //searching
    if (req.query.name) {
      query.push({
        $match: {
          $or: [
            {
              name: { $regex: req.query.name },
            },
          ],
        },
      });
    }

    //   if (req.query.name) {
    //     query.push({
    //       $match: { name: req.query.name },
    //     });
    //   }

    if (req.query._id) {
      query = [
        {
          $match: {
            _id: mongoose.Types.ObjectId(req.query._id),
          },
        },
      ];
    }
    console.log(query);
    //pagination;
    let total = await Employee.countDocuments(query);
    console.log(total);
    let page = req.query.page ? parseInt(req.query.page) : 1;
    console.log(page);
    let perPage = req.query.perPage ? parseInt(req.query.perPage) : 5;
    console.log(perPage);
    let skip = (page - 1) * perPage;
    console.log(skip);
    query.push({
      $skip: skip,
    });
    query.push({
      $limit: perPage,
    });

    query.push({
      $project: {
        name: 1,
        desination: 1,
        email: 1,
        phone: 1,
        age: 1,
        createdAt: 1,
        updatedAt: 1,
      },
    });
    // sorting
    if (req.query.sortBy && req.query.sortOrder) {
      var sort = {};
      sort[req.query.sortBy] = req.query.sortOrder == "asc" ? 1 : -1;
      query.push({
        $sort: sort,
      });
    } else {
      query.push({
        $sort: { createdAt: -1 },
      });
    }

    let employees;

    if (query == [{ $skip: 0 }, { $limit: 5 }]) {
      employees = Employee.find(query);
    } else {
      employees = Employee.aggregate(query);
    }
    employees = Employee.find(query);
    employees = await Employee.aggregate(query);
    res.status(200).json({
      message: "Employee List",
      result: employees,
      meta: {
        total: total,
        currentPage: page,
        perPage: perPage,
        totalPages: Math.ceil(total / perPage),
      },
    });
  } catch (err) {
    res.status(400).json({
      message: "Error Ocurred",
      error: err.message,
    });
  }
};

const EmployeeById = (req, res, next) => {
  let employeeId = req.params.id;
  Employee.findById(employeeId).then((data) => {
    if (data) {
      Employee.findById(employeeId)
        .then((result) => {
          res.status(200).json({
            message: "Employee Single Record",
            result,
          });
        })
        .catch((error) => {
          res.status(400).json({
            message: "Error Ocurred",
            error: error,
          });
        });
    } else {
      res.status(404).json({
        message: "Record is not found",
      });
    }
  });
};

const CreateEmployee = (req, res, next) => {
  const v = new Validator(req.body, {
    name: "required",
    desination: "required",
    email: "required|email",
    phone: "required",
    age: "required",
  });

  v.check().then((matched) => {
    if (!matched) {
      res.status(422).send(v.errors);
    }
  });
  console.log(req.body);
  let employee = new Employee({
    name: req.body.name,
    desination: req.body.desination,
    email: req.body.email,
    age: req.body.age,
    phone: req.body.phone,
  });
  employee
    .save()
    .then((result) => {
      res.status(200).json({
        message: "Create Employee Successfully",
        result,
      });
    })
    .catch((error) => {
      res.status(400).json({
        message: "Error Ocurred",
        error: error,
      });
    });
};

const updateEmployee = (req, res, next) => {
  const v = new Validator(req.body, {
    name: "required",
    desination: "required",
    email: "required|email",
    phone: "required",
    age: "required",
  });

  v.check().then((matched) => {
    if (!matched) {
      res.status(422).send(v.errors);
    }
  });
  let employeeId = req.params.id;
  Employee.findById(employeeId).then((data) => {
    if (data) {
      let updatedEmployee = {
        name: req.body.name,
        desination: req.body.desination,
        email: req.body.email,
        age: req.body.age,
        phone: req.body.phone,
      };
      console.log(updatedEmployee);

      Employee.findByIdAndUpdate(
        employeeId,
        { $set: updatedEmployee },
        {
          new: true,
        }
      )
        .then((result) => {
          res.status(200).json({
            message: "Update Employee Successfully",
            result,
          });
        })
        .catch((error) => {
          res.status(400).json({
            message: "Error Ocurred",
            error: error,
          });
        });
    } else {
      res.status(404).json({
        message: "Record is not found",
      });
    }
  });
};

const deleteEmployee = (req, res, next) => {
  let employeeId = req.params.id;
  Employee.findById(employeeId).then((data) => {
    if (data) {
      Employee.findByIdAndRemove(employeeId)
        .then((result) => {
          res.status(200).json({
            message: "Delete Employee Successfully",
          });
        })
        .catch((error) => {
          res.status(400).json({
            message: "Error Ocurred",
            error: error,
          });
        });
    } else {
      res.status(404).json({
        message: "Record is not found",
      });
    }
  });
};

module.exports = {
  EmployeeList,
  EmployeeById,
  CreateEmployee,
  updateEmployee,
  deleteEmployee,
};
