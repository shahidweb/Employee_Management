import "dotenv/config";

import mongoose from "mongoose";
import bcrypt from "bcryptjs";

import { Employee } from "../modules/employee/employee.model";
import { Counter } from "../modules/employee/counter.model";

const seedAdmin = async () => {
    try {
        // 1. Read environment variables
        const {
            MONGO_URI,
            ADMIN_NAME,
            ADMIN_EMAIL,
            ADMIN_PASSWORD,
            ADMIN_CONTACT,
            ADMIN_DEPT_ID
        } = process.env;

        if (
            !MONGO_URI ||
            !ADMIN_NAME ||
            !ADMIN_EMAIL ||
            !ADMIN_PASSWORD ||
            !ADMIN_CONTACT ||
            !ADMIN_DEPT_ID
        ) {
            throw new Error("Required Admin environment variables are missing");
        }

        // 2. Connect MongoDB
        await mongoose.connect(MONGO_URI);

        console.log("MongoDB connected successfully");

        // 3. Check if Admin already exists
        const existingAdmin = await Employee.findOne({
            emailId: ADMIN_EMAIL.toLowerCase()
        });

        if (existingAdmin) {
            console.log("Employee with this email already exists.");

            if (existingAdmin.role !== "Admin") {
                console.log("Existing account is not an Admin. No changes made.");
            } else {
                console.log("Admin account already exists.");
            }

            return;
        }

        // 4. Generate employee ID
        const counter = await Counter.findByIdAndUpdate(
            "employeeId",
            { $inc: { sequence: 1 } },
            {
                new: true,
                upsert: true
            }
        );

        if (!counter) {
            throw new Error("Unable to generate employee ID");
        }

        // 5. Hash password
        const hashedPassword = await bcrypt.hash(
            ADMIN_PASSWORD,
            12
        );

        // 6. Create Admin
        const admin = await Employee.create({
            employeeId: counter.sequence,
            employeeName: ADMIN_NAME,
            contactNo: ADMIN_CONTACT,
            emailId: ADMIN_EMAIL.toLowerCase(),
            deptId: Number(ADMIN_DEPT_ID),
            password: hashedPassword,
            gender: "Other",
            role: "Admin",
            isActive: true,
        });

        console.log("Admin created successfully!");
        console.log({
            employeeId: admin.employeeId,
            employeeName: admin.employeeName,
            emailId: admin.emailId,
            role: admin.role
        });

    } catch (error) {
        console.error("Admin seed failed:", error);
        process.exitCode = 1;

    } finally {
        await mongoose.disconnect();
    }
};

seedAdmin();