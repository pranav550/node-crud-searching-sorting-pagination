const express = require("express");
const router = express.Router();
const EmployeeController = require("../controllers/EmployeeController");

router.get('/', EmployeeController.EmployeeList);
router.get('/single/:id', EmployeeController.EmployeeById);
router.post('/add', EmployeeController.CreateEmployee);
router.put('/update/:id', EmployeeController.updateEmployee);
router.delete('/delete/:id', EmployeeController.deleteEmployee);


module.exports = router
