import { Router } from "express";
import authRoutes from "../modules/auth/auth.routes";
import childDepartmentRoutes from "../modules/childDepartment/childDepartment.routes";
import departmentRoutes from "../modules/department/department.routes";
import employeeRoutes from "../modules/employee/employee.routes";
import projectRoutes from "../modules/project/project.routes";
import projectEmployeeRoutes from "../modules/projectEmployee/projectEmployee.routes";


const router = Router();

router.get("/", (_, res) => {
    return res.status(200).json({
        success: true,
        message: "Employee Management API is healthy"
    });
});

router.use('/auth', authRoutes)
router.use('/employee', employeeRoutes)
router.use('/project', projectRoutes)
router.use('/projectEmployee', projectEmployeeRoutes)
router.use('/departments', departmentRoutes)
router.use('/child-departments', childDepartmentRoutes)

export default router;