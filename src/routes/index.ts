import { Router } from "express";
import authRoutes from "../modules/auth/auth.routes"
import employeeRoutes from "../modules/employee/employee.routes"

const router = Router();

router.get("/", (_, res) => {
    return res.status(200).json({
        success: true,
        message: "Employee Management API is healthy"
    });
});

router.use('/auth', authRoutes)
router.use('/employee', employeeRoutes)

export default router;