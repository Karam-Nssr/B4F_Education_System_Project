import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcrypt";

import {
  UserModel as User,
  USER_ROLES,
  USER_STATUSES,
} from "../modules/users/User.js";
import {
  CourseModel as Course,
  COURSE_STATUSES,
} from "../modules/courses/Course.js";
import { SessionModel as Session } from "../modules/sessions/Session.js";

const MONGO_URI: string = "mongodb://127.0.0.1:27017/education_management"; // استبدليها باسم قاعدة البيانات لديك

const seedDatabase = async (): Promise<void> => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB for Seeding...");

    // 1. مسح البيانات القديمة لتجنب التكرار
    await User.deleteMany({});
    await Course.deleteMany({});
    await Session.deleteMany({});
    console.log("Old data cleared!");
    const salt = await bcrypt.genSalt(10);
    const hashedPasswordAdmin = await bcrypt.hash("admin@lms", salt);
    await User.create({
      first_name: "System",
      last_name: "Admin",
      phone_number: 963900000000,
      email: "admin@lms.com",
      password: hashedPasswordAdmin,
      role: "admin",
      status: "active",
    });
    // تشفير كلمة المرور الافتراضية
    const hashedPassword: string = await bcrypt.hash("Password123", 10);

    // ==========================================
    // 2. إدخال المستخدمين (مدرسين وطلاب)
    // ==========================================
    const users = await User.insertMany([
      // --- Teachers ---
      {
        first_name: "Omar",
        last_name: "El-Masri",
        phone_number: 931234567,
        email: "omar.teacher@example.com",
        password: hashedPassword,
        role: "teacher",
        status: "active",
      },
      {
        first_name: "Sara",
        last_name: "Khatib",
        phone_number: 941112233,
        email: "sara.teacher@example.com",
        password: hashedPassword,
        role: "teacher",
        status: "active",
      },
      {
        first_name: "Raid",
        last_name: "Haddad",
        phone_number: 952223344,
        email: "raid.teacher@example.com",
        password: hashedPassword,
        role: "teacher",
        status: "active",
      },

      // --- Students ---
      {
        first_name: "Leen",
        last_name: "Saeed",
        phone_number: 987654321,
        email: "leen.student@example.com",
        password: hashedPassword,
        role: "student",
        status: "active",
      },
      {
        first_name: "Michael",
        last_name: "Nour",
        phone_number: 912345678,
        email: "michael.student@example.com",
        password: hashedPassword,
        role: "student",
        status: "active",
      },
      {
        first_name: "Nour",
        last_name: "Ali",
        phone_number: 965554433,
        email: "nour.student@example.com",
        password: hashedPassword,
        role: "student",
        status: "active",
      },
    ]);

    const teachers = users.filter((u: any) => u.role === "teacher");
    console.log("Users seeded successfully!");

    // ==========================================
    // 3. إدخال الكورسات (MERN, English, Soft Skills)
    // ==========================================
    const courses = await Course.insertMany([
      {
        title: "MERN Stack Web Development",
        teacher: teachers[0]._id,
        duration_hours: 60,
        image:
          "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=80",
        status: "active",
      },
      {
        title: "Professional English Language",
        teacher: teachers[1]._id,
        duration_hours: 30,
        image:
          "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800&auto=format&fit=crop&q=80",
        status: "active",
      },
      {
        title: "Soft Skills & Professional Communication",
        teacher: teachers[2]._id,
        duration_hours: 15,
        image:
          "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80",
        status: "active",
      },
    ]);

    console.log("Courses seeded successfully!");

    // ==========================================
    // 4. إدخال الجلسات (Sessions)
    // ==========================================
    await Session.insertMany([
      // MERN Stack Sessions
      {
        course: courses[0]._id,
        content:
          "Introduction to Node.js, Express Setup, and Middleware Configuration",
        session_date: new Date("2026-11-01T10:00:00.000Z"),
      },
      {
        course: courses[0]._id,
        content:
          "MongoDB Integration using Mongoose & Schema Modeling Patterns",
        session_date: new Date("2026-11-03T10:00:00.000Z"),
      },
      {
        course: courses[0]._id,
        content:
          "Building RESTful APIs with Controllers and React Router Integration",
        session_date: new Date("2026-11-05T10:00:00.000Z"),
      },

      // English Course Sessions
      {
        course: courses[1]._id,
        content: "Business Communication & Email Writing Fundamentals",
        session_date: new Date("2026-11-02T14:00:00.000Z"),
      },
      {
        course: courses[1]._id,
        content:
          "Technical Vocabulary & Effective Public Speaking for Developers",
        session_date: new Date("2026-11-04T14:00:00.000Z"),
      },

      // Soft Skills Course Sessions
      {
        course: courses[2]._id,
        content: "Time Management, Teamwork, and Agile Workflow Best Practices",
        session_date: new Date("2026-11-06T16:00:00.000Z"),
      },
    ]);

    console.log("Sessions seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
};

seedDatabase();
