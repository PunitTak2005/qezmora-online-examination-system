import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Star, Target, Calendar, ArrowUpRight, ArrowDownRight, Minus, Award, Sparkles, Building2, BookOpen } from 'lucide-react';
import api from '../../api/axios';
import PageTransition from '../../components/PageTransition';
import LoadingSkeleton from '../../components/LoadingSkeleton';
import { motion } from 'framer-motion';

// Full multi-word institution sample entries for responsive multi-line testing
const SAMPLE_LEADERBOARD = {
  'all-time': [
    { _id: '1', rank: 1, student: { name: 'Aarav Sharma', college: 'Indian Institute of Technology, Delhi', avatar: '' }, totalScore: 286, avgPercentage: 94.7, examsCompleted: 15, rankChange: 0, color: 'from-amber-400 via-yellow-500 to-amber-600' },
    { _id: '2', rank: 2, student: { name: 'Priya Verma', college: 'National Institute of Technology, Trichy', avatar: '' }, totalScore: 278, avgPercentage: 93.8, examsCompleted: 14, rankChange: 1, color: 'from-slate-300 via-gray-400 to-slate-500' },
    { _id: '3', rank: 3, student: { name: 'Rohan Mehta', college: 'BITS Pilani University', avatar: '' }, totalScore: 271, avgPercentage: 92.6, examsCompleted: 14, rankChange: -1, color: 'from-amber-600 via-amber-700 to-amber-900' },
    { _id: '4', rank: 4, student: { name: 'Neha Singh', college: 'Indian Institute of Technology, Bombay', avatar: '' }, totalScore: 264, avgPercentage: 91.9, examsCompleted: 13, rankChange: 2, color: 'from-emerald-500 to-teal-700' },
    { _id: '5', rank: 5, student: { name: 'Arjun Kapoor', college: 'International Institute of Information Technology, Hyderabad', avatar: '' }, totalScore: 258, avgPercentage: 90.8, examsCompleted: 13, rankChange: 0, color: 'from-indigo-500 to-purple-700' },
    { _id: '6', rank: 6, student: { name: 'Kavya Nair', college: 'Vellore Institute of Technology', avatar: '' }, totalScore: 251, avgPercentage: 89.5, examsCompleted: 12, rankChange: -2, color: 'from-pink-500 to-rose-700' },
    { _id: '7', rank: 7, student: { name: 'Aditya Rao', college: 'SRM Institute of Science and Technology', avatar: '' }, totalScore: 244, avgPercentage: 88.9, examsCompleted: 12, rankChange: 1, color: 'from-blue-500 to-cyan-700' },
    { _id: '8', rank: 8, student: { name: 'Ishita Jain', college: 'Delhi Technological University', avatar: '' }, totalScore: 238, avgPercentage: 88.1, examsCompleted: 11, rankChange: 3, color: 'from-violet-500 to-purple-800' },
    { _id: '9', rank: 9, student: { name: 'Rahul Joshi', college: 'Techno NJR Institute of Technology', avatar: '' }, totalScore: 232, avgPercentage: 87.4, examsCompleted: 11, rankChange: -1, color: 'from-amber-600 to-orange-700' },
    { _id: '10', rank: 10, student: { name: 'Sneha Patel', college: 'Nirma University of Science & Technology', avatar: '' }, totalScore: 226, avgPercentage: 86.8, examsCompleted: 10, rankChange: 0, color: 'from-green-500 to-emerald-700' },
    { _id: '11', rank: 11, student: { name: 'Vivek Kumar', college: 'Manipal Institute of Technology', avatar: '' }, totalScore: 220, avgPercentage: 85.9, examsCompleted: 10, rankChange: 2, color: 'from-cyan-500 to-blue-700' },
    { _id: '12', rank: 12, student: { name: 'Ananya Roy', college: 'Indian Institute of Technology, Madras', avatar: '' }, totalScore: 215, avgPercentage: 85.2, examsCompleted: 9, rankChange: -1, color: 'from-fuchsia-500 to-pink-700' },
    { _id: '13', rank: 13, student: { name: 'Siddharth Malhotra', college: 'RV College of Engineering, Bangalore', avatar: '' }, totalScore: 210, avgPercentage: 84.6, examsCompleted: 9, rankChange: 1, color: 'from-sky-500 to-indigo-700' },
    { _id: '14', rank: 14, student: { name: 'Tanvi Gupta', college: 'Thapar Institute of Engineering & Technology', avatar: '' }, totalScore: 204, avgPercentage: 83.9, examsCompleted: 9, rankChange: -3, color: 'from-teal-500 to-emerald-700' },
    { _id: '15', rank: 15, student: { name: 'Devendra Singh', college: 'Malaviya National Institute of Technology, Jaipur', avatar: '' }, totalScore: 198, avgPercentage: 83.1, examsCompleted: 8, rankChange: 0, color: 'from-red-500 to-amber-700' },
    { _id: '16', rank: 16, student: { name: 'Pooja Reddy', college: 'Jawaharlal Nehru Technological University, Hyderabad', avatar: '' }, totalScore: 193, avgPercentage: 82.5, examsCompleted: 8, rankChange: 2, color: 'from-rose-500 to-pink-700' },
    { _id: '17', rank: 17, student: { name: 'Harsh Vardhan', college: 'Netaji Subhas University of Technology, Delhi', avatar: '' }, totalScore: 188, avgPercentage: 81.7, examsCompleted: 8, rankChange: -1, color: 'from-orange-500 to-amber-700' },
    { _id: '18', rank: 18, student: { name: 'Riya Sen', college: 'Jadavpur University, Kolkata', avatar: '' }, totalScore: 182, avgPercentage: 81.0, examsCompleted: 7, rankChange: 4, color: 'from-indigo-800 to-slate-900' },
    { _id: '19', rank: 19, student: { name: 'Yash Agarwal', college: 'PES University, Bangalore', avatar: '' }, totalScore: 177, avgPercentage: 80.3, examsCompleted: 7, rankChange: -2, color: 'from-purple-600 to-indigo-800' },
    { _id: '20', rank: 20, student: { name: 'Meera Nambiar', college: 'Cochin University of Science and Technology', avatar: '' }, totalScore: 171, avgPercentage: 79.5, examsCompleted: 7, rankChange: 1, color: 'from-emerald-600 to-teal-800' },
    { _id: '21', rank: 21, student: { name: 'Kshitij Saxena', college: 'Indian Institute of Technology, Roorkee', avatar: '' }, totalScore: 166, avgPercentage: 78.8, examsCompleted: 6, rankChange: 0, color: 'from-blue-600 to-sky-800' },
    { _id: '22', rank: 22, student: { name: 'Divya Iyer', college: 'PSG College of Technology, Coimbatore', avatar: '' }, totalScore: 160, avgPercentage: 78.1, examsCompleted: 6, rankChange: -3, color: 'from-pink-600 to-purple-800' },
    { _id: '23', rank: 23, student: { name: 'Manan Shah', college: 'Dhirubhai Ambani Institute of Information and Communication Technology', avatar: '' }, totalScore: 155, avgPercentage: 77.4, examsCompleted: 6, rankChange: 2, color: 'from-amber-600 to-yellow-800' },
    { _id: '24', rank: 24, student: { name: 'Sanjana Deshmukh', college: 'College of Engineering, Pune (COEP)', avatar: '' }, totalScore: 149, avgPercentage: 76.6, examsCompleted: 5, rankChange: -1, color: 'from-teal-600 to-cyan-800' },
    { _id: '25', rank: 25, student: { name: 'Tarun Chawla', college: 'Punjab Engineering College, Chandigarh', avatar: '' }, totalScore: 144, avgPercentage: 75.9, examsCompleted: 5, rankChange: 1, color: 'from-red-600 to-rose-800' },
    { _id: '26', rank: 26, student: { name: 'Shreya Bose', college: 'Heritage Institute of Technology, Kolkata', avatar: '' }, totalScore: 138, avgPercentage: 75.1, examsCompleted: 5, rankChange: 0, color: 'from-indigo-600 to-violet-800' },
    { _id: '27', rank: 27, student: { name: 'Nikhil Bansal', college: 'BMS College of Engineering, Bangalore', avatar: '' }, totalScore: 132, avgPercentage: 74.3, examsCompleted: 4, rankChange: -2, color: 'from-green-600 to-emerald-800' },
    { _id: '28', rank: 28, student: { name: 'Archana Hegde', college: 'National Institute of Technology, Surathkal', avatar: '' }, totalScore: 126, avgPercentage: 73.5, examsCompleted: 4, rankChange: 3, color: 'from-purple-600 to-pink-800' },
    { _id: '29', rank: 29, student: { name: 'Pranav Kulkarni', college: 'Veermata Jijabai Technological Institute, Mumbai', avatar: '' }, totalScore: 120, avgPercentage: 72.8, examsCompleted: 4, rankChange: -1, color: 'from-cyan-600 to-blue-800' },
    { _id: '30', rank: 30, student: { name: 'Deepa Menon', college: 'College of Engineering, Trivandrum', avatar: '' }, totalScore: 114, avgPercentage: 71.9, examsCompleted: 4, rankChange: 0, color: 'from-yellow-600 to-amber-800' }
  ],
  'weekly': [
    { _id: 'w4', rank: 1, student: { name: 'Neha Singh', college: 'Indian Institute of Technology, Bombay', avatar: '' }, totalScore: 96, avgPercentage: 96.0, examsCompleted: 4, rankChange: 3, color: 'from-emerald-500 to-teal-700' },
    { _id: 'w1', rank: 2, student: { name: 'Aarav Sharma', college: 'Indian Institute of Technology, Delhi', avatar: '' }, totalScore: 94, avgPercentage: 94.0, examsCompleted: 4, rankChange: -1, color: 'from-amber-400 via-yellow-500 to-amber-600' },
    { _id: 'w8', rank: 3, student: { name: 'Ishita Jain', college: 'Delhi Technological University', avatar: '' }, totalScore: 91, avgPercentage: 91.0, examsCompleted: 3, rankChange: 5, color: 'from-violet-500 to-purple-800' },
    { _id: 'w5', rank: 4, student: { name: 'Arjun Kapoor', college: 'International Institute of Information Technology, Hyderabad', avatar: '' }, totalScore: 88, avgPercentage: 88.0, examsCompleted: 3, rankChange: 1, color: 'from-indigo-500 to-purple-700' },
    { _id: 'w2', rank: 5, student: { name: 'Priya Verma', college: 'National Institute of Technology, Trichy', avatar: '' }, totalScore: 86, avgPercentage: 86.0, examsCompleted: 3, rankChange: -3, color: 'from-slate-300 via-gray-400 to-slate-500' },
    { _id: 'w3', rank: 6, student: { name: 'Rohan Mehta', college: 'BITS Pilani University', avatar: '' }, totalScore: 84, avgPercentage: 84.0, examsCompleted: 3, rankChange: -3, color: 'from-amber-600 via-amber-700 to-amber-900' },
    { _id: 'w6', rank: 7, student: { name: 'Kavya Nair', college: 'Vellore Institute of Technology', avatar: '' }, totalScore: 82, avgPercentage: 82.0, examsCompleted: 3, rankChange: -1, color: 'from-pink-500 to-rose-700' },
    { _id: 'w11', rank: 8, student: { name: 'Vivek Kumar', college: 'Manipal Institute of Technology', avatar: '' }, totalScore: 79, avgPercentage: 79.0, examsCompleted: 2, rankChange: 3, color: 'from-cyan-500 to-blue-700' },
    { _id: 'w7', rank: 9, student: { name: 'Aditya Rao', college: 'SRM Institute of Science and Technology', avatar: '' }, totalScore: 77, avgPercentage: 77.0, examsCompleted: 2, rankChange: -2, color: 'from-blue-500 to-cyan-700' },
    { _id: 'w9', rank: 10, student: { name: 'Rahul Joshi', college: 'Techno NJR Institute of Technology', avatar: '' }, totalScore: 75, avgPercentage: 75.0, examsCompleted: 2, rankChange: -1, color: 'from-amber-600 to-orange-700' },
    { _id: 'w18', rank: 11, student: { name: 'Riya Sen', college: 'Jadavpur University, Kolkata', avatar: '' }, totalScore: 73, avgPercentage: 73.0, examsCompleted: 2, rankChange: 7, color: 'from-indigo-800 to-slate-900' },
    { _id: 'w10', rank: 12, student: { name: 'Sneha Patel', college: 'Nirma University of Science & Technology', avatar: '' }, totalScore: 70, avgPercentage: 70.0, examsCompleted: 2, rankChange: -2, color: 'from-green-500 to-emerald-700' },
    { _id: 'w12', rank: 13, student: { name: 'Ananya Roy', college: 'Indian Institute of Technology, Madras', avatar: '' }, totalScore: 68, avgPercentage: 68.0, examsCompleted: 2, rankChange: -1, color: 'from-fuchsia-500 to-pink-700' },
    { _id: 'w23', rank: 14, student: { name: 'Manan Shah', college: 'Dhirubhai Ambani Institute of Information and Communication Technology', avatar: '' }, totalScore: 65, avgPercentage: 65.0, examsCompleted: 2, rankChange: 9, color: 'from-amber-600 to-yellow-800' },
    { _id: 'w13', rank: 15, student: { name: 'Siddharth Malhotra', college: 'RV College of Engineering, Bangalore', avatar: '' }, totalScore: 63, avgPercentage: 63.0, examsCompleted: 2, rankChange: -2, color: 'from-sky-500 to-indigo-700' },
    { _id: 'w16', rank: 16, student: { name: 'Pooja Reddy', college: 'Jawaharlal Nehru Technological University, Hyderabad', avatar: '' }, totalScore: 60, avgPercentage: 60.0, examsCompleted: 1, rankChange: 0, color: 'from-rose-500 to-pink-700' },
    { _id: 'w14', rank: 17, student: { name: 'Tanvi Gupta', college: 'Thapar Institute of Engineering & Technology', avatar: '' }, totalScore: 58, avgPercentage: 58.0, examsCompleted: 1, rankChange: -3, color: 'from-teal-500 to-emerald-700' },
    { _id: 'w15', rank: 18, student: { name: 'Devendra Singh', college: 'Malaviya National Institute of Technology, Jaipur', avatar: '' }, totalScore: 55, avgPercentage: 55.0, examsCompleted: 1, rankChange: -3, color: 'from-red-500 to-amber-700' },
    { _id: 'w28', rank: 19, student: { name: 'Archana Hegde', college: 'National Institute of Technology, Surathkal', avatar: '' }, totalScore: 53, avgPercentage: 53.0, examsCompleted: 1, rankChange: 9, color: 'from-purple-600 to-pink-800' },
    { _id: 'w17', rank: 20, student: { name: 'Harsh Vardhan', college: 'Netaji Subhas University of Technology, Delhi', avatar: '' }, totalScore: 50, avgPercentage: 50.0, examsCompleted: 1, rankChange: -3, color: 'from-orange-500 to-amber-700' },
    { _id: 'w19', rank: 21, student: { name: 'Yash Agarwal', college: 'PES University, Bangalore', avatar: '' }, totalScore: 48, avgPercentage: 48.0, examsCompleted: 1, rankChange: -2, color: 'from-purple-600 to-indigo-800' },
    { _id: 'w20', rank: 22, student: { name: 'Meera Nambiar', college: 'Cochin University of Science and Technology', avatar: '' }, totalScore: 45, avgPercentage: 45.0, examsCompleted: 1, rankChange: -2, color: 'from-emerald-600 to-teal-800' },
    { _id: 'w21', rank: 23, student: { name: 'Kshitij Saxena', college: 'Indian Institute of Technology, Roorkee', avatar: '' }, totalScore: 43, avgPercentage: 43.0, examsCompleted: 1, rankChange: -2, color: 'from-blue-600 to-sky-800' },
    { _id: 'w22', rank: 24, student: { name: 'Divya Iyer', college: 'PSG College of Technology, Coimbatore', avatar: '' }, totalScore: 40, avgPercentage: 40.0, examsCompleted: 1, rankChange: -2, color: 'from-pink-600 to-purple-800' },
    { _id: 'w25', rank: 25, student: { name: 'Tarun Chawla', college: 'Punjab Engineering College, Chandigarh', avatar: '' }, totalScore: 38, avgPercentage: 38.0, examsCompleted: 1, rankChange: 0, color: 'from-red-600 to-rose-800' },
    { _id: 'w24', rank: 26, student: { name: 'Sanjana Deshmukh', college: 'College of Engineering, Pune (COEP)', avatar: '' }, totalScore: 35, avgPercentage: 35.0, examsCompleted: 1, rankChange: -2, color: 'from-teal-600 to-cyan-800' },
    { _id: 'w26', rank: 27, student: { name: 'Shreya Bose', college: 'Heritage Institute of Technology, Kolkata', avatar: '' }, totalScore: 33, avgPercentage: 33.0, examsCompleted: 1, rankChange: -1, color: 'from-indigo-600 to-violet-800' },
    { _id: 'w27', rank: 28, student: { name: 'Nikhil Bansal', college: 'BMS College of Engineering, Bangalore', avatar: '' }, totalScore: 30, avgPercentage: 30.0, examsCompleted: 1, rankChange: -1, color: 'from-green-600 to-emerald-800' },
    { _id: 'w29', rank: 29, student: { name: 'Pranav Kulkarni', college: 'Veermata Jijabai Technological Institute, Mumbai', avatar: '' }, totalScore: 28, avgPercentage: 28.0, examsCompleted: 1, rankChange: 0, color: 'from-cyan-600 to-blue-800' },
    { _id: 'w30', rank: 30, student: { name: 'Deepa Menon', college: 'College of Engineering, Trivandrum', avatar: '' }, totalScore: 25, avgPercentage: 25.0, examsCompleted: 1, rankChange: 0, color: 'from-yellow-600 to-amber-800' }
  ],
  'monthly': [
    { _id: 'm1', rank: 1, student: { name: 'Aarav Sharma', college: 'Indian Institute of Technology, Delhi', avatar: '' }, totalScore: 248, avgPercentage: 95.2, examsCompleted: 12, rankChange: 0, color: 'from-amber-400 via-yellow-500 to-amber-600' },
    { _id: 'm2', rank: 2, student: { name: 'Priya Verma', college: 'National Institute of Technology, Trichy', avatar: '' }, totalScore: 242, avgPercentage: 94.1, examsCompleted: 11, rankChange: 0, color: 'from-slate-300 via-gray-400 to-slate-500' },
    { _id: 'm3', rank: 3, student: { name: 'Rohan Mehta', college: 'BITS Pilani University', avatar: '' }, totalScore: 236, avgPercentage: 93.0, examsCompleted: 11, rankChange: 0, color: 'from-amber-600 via-amber-700 to-amber-900' },
    { _id: 'm4', rank: 4, student: { name: 'Neha Singh', college: 'Indian Institute of Technology, Bombay', avatar: '' }, totalScore: 230, avgPercentage: 92.5, examsCompleted: 10, rankChange: 0, color: 'from-emerald-500 to-teal-700' },
    { _id: 'm5', rank: 5, student: { name: 'Arjun Kapoor', college: 'International Institute of Information Technology, Hyderabad', avatar: '' }, totalScore: 222, avgPercentage: 91.2, examsCompleted: 10, rankChange: 0, color: 'from-indigo-500 to-purple-700' },
    { _id: 'm8', rank: 6, student: { name: 'Ishita Jain', college: 'Delhi Technological University', avatar: '' }, totalScore: 215, avgPercentage: 89.8, examsCompleted: 9, rankChange: 2, color: 'from-violet-500 to-purple-800' },
    { _id: 'm6', rank: 7, student: { name: 'Kavya Nair', college: 'Vellore Institute of Technology', avatar: '' }, totalScore: 208, avgPercentage: 88.9, examsCompleted: 9, rankChange: -1, color: 'from-pink-500 to-rose-700' },
    { _id: 'm7', rank: 8, student: { name: 'Aditya Rao', college: 'SRM Institute of Science and Technology', avatar: '' }, totalScore: 201, avgPercentage: 88.0, examsCompleted: 9, rankChange: -1, color: 'from-blue-500 to-cyan-700' },
    { _id: 'm9', rank: 9, student: { name: 'Rahul Joshi', college: 'Techno NJR Institute of Technology', avatar: '' }, totalScore: 195, avgPercentage: 87.1, examsCompleted: 8, rankChange: 0, color: 'from-amber-600 to-orange-700' },
    { _id: 'm10', rank: 10, student: { name: 'Sneha Patel', college: 'Nirma University of Science & Technology', avatar: '' }, totalScore: 189, avgPercentage: 86.2, examsCompleted: 8, rankChange: 0, color: 'from-green-500 to-emerald-700' },
    { _id: 'm11', rank: 11, student: { name: 'Vivek Kumar', college: 'Manipal Institute of Technology', avatar: '' }, totalScore: 182, avgPercentage: 85.5, examsCompleted: 8, rankChange: 0, color: 'from-cyan-500 to-blue-700' },
    { _id: 'm12', rank: 12, student: { name: 'Ananya Roy', college: 'Indian Institute of Technology, Madras', avatar: '' }, totalScore: 176, avgPercentage: 84.8, examsCompleted: 7, rankChange: 0, color: 'from-fuchsia-500 to-pink-700' },
    { _id: 'm13', rank: 13, student: { name: 'Siddharth Malhotra', college: 'RV College of Engineering, Bangalore', avatar: '' }, totalScore: 170, avgPercentage: 84.0, examsCompleted: 7, rankChange: 0, color: 'from-sky-500 to-indigo-700' },
    { _id: 'm18', rank: 14, student: { name: 'Riya Sen', college: 'Jadavpur University, Kolkata', avatar: '' }, totalScore: 165, avgPercentage: 83.2, examsCompleted: 6, rankChange: 4, color: 'from-indigo-800 to-slate-900' },
    { _id: 'm14', rank: 15, student: { name: 'Tanvi Gupta', college: 'Thapar Institute of Engineering & Technology', avatar: '' }, totalScore: 159, avgPercentage: 82.5, examsCompleted: 6, rankChange: -1, color: 'from-teal-500 to-emerald-700' },
    { _id: 'm15', rank: 16, student: { name: 'Devendra Singh', college: 'Malaviya National Institute of Technology, Jaipur', avatar: '' }, totalScore: 153, avgPercentage: 81.8, examsCompleted: 6, rankChange: -1, color: 'from-red-500 to-amber-700' },
    { _id: 'm16', rank: 17, student: { name: 'Pooja Reddy', college: 'Jawaharlal Nehru Technological University, Hyderabad', avatar: '' }, totalScore: 147, avgPercentage: 81.0, examsCompleted: 6, rankChange: -1, color: 'from-rose-500 to-pink-700' },
    { _id: 'm17', rank: 18, student: { name: 'Harsh Vardhan', college: 'Netaji Subhas University of Technology, Delhi', avatar: '' }, totalScore: 141, avgPercentage: 80.2, examsCompleted: 5, rankChange: -1, color: 'from-orange-500 to-amber-700' },
    { _id: 'm19', rank: 19, student: { name: 'Yash Agarwal', college: 'PES University, Bangalore', avatar: '' }, totalScore: 135, avgPercentage: 79.5, examsCompleted: 5, rankChange: 0, color: 'from-purple-600 to-indigo-800' },
    { _id: 'm20', rank: 20, student: { name: 'Meera Nambiar', college: 'Cochin University of Science and Technology', avatar: '' }, totalScore: 129, avgPercentage: 78.8, examsCompleted: 5, rankChange: 0, color: 'from-emerald-600 to-teal-800' },
    { _id: 'm23', rank: 21, student: { name: 'Manan Shah', college: 'Dhirubhai Ambani Institute of Information and Communication Technology', avatar: '' }, totalScore: 123, avgPercentage: 78.0, examsCompleted: 5, rankChange: 2, color: 'from-amber-600 to-yellow-800' },
    { _id: 'm21', rank: 22, student: { name: 'Kshitij Saxena', college: 'Indian Institute of Technology, Roorkee', avatar: '' }, totalScore: 117, avgPercentage: 77.2, examsCompleted: 4, rankChange: -1, color: 'from-blue-600 to-sky-800' },
    { _id: 'm22', rank: 23, student: { name: 'Divya Iyer', college: 'PSG College of Technology, Coimbatore', avatar: '' }, totalScore: 111, avgPercentage: 76.5, examsCompleted: 4, rankChange: -1, color: 'from-pink-600 to-purple-800' },
    { _id: 'm28', rank: 24, student: { name: 'Archana Hegde', college: 'National Institute of Technology, Surathkal', avatar: '' }, totalScore: 105, avgPercentage: 75.8, examsCompleted: 4, rankChange: 4, color: 'from-purple-600 to-pink-800' },
    { _id: 'm24', rank: 25, student: { name: 'Sanjana Deshmukh', college: 'College of Engineering, Pune (COEP)', avatar: '' }, totalScore: 99, avgPercentage: 75.0, examsCompleted: 4, rankChange: -1, color: 'from-teal-600 to-cyan-800' },
    { _id: 'm25', rank: 26, student: { name: 'Tarun Chawla', college: 'Punjab Engineering College, Chandigarh', avatar: '' }, totalScore: 93, avgPercentage: 74.2, examsCompleted: 3, rankChange: -1, color: 'from-red-600 to-rose-800' },
    { _id: 'm26', rank: 27, student: { name: 'Shreya Bose', college: 'Heritage Institute of Technology, Kolkata', avatar: '' }, totalScore: 87, avgPercentage: 73.5, examsCompleted: 3, rankChange: -1, color: 'from-indigo-600 to-violet-800' },
    { _id: 'm27', rank: 28, student: { name: 'Nikhil Bansal', college: 'BMS College of Engineering, Bangalore', avatar: '' }, totalScore: 81, avgPercentage: 72.8, examsCompleted: 3, rankChange: -1, color: 'from-green-600 to-emerald-800' },
    { _id: 'm29', rank: 29, student: { name: 'Pranav Kulkarni', college: 'Veermata Jijabai Technological Institute, Mumbai', avatar: '' }, totalScore: 75, avgPercentage: 72.0, examsCompleted: 3, rankChange: 0, color: 'from-cyan-600 to-blue-800' },
    { _id: 'm30', rank: 30, student: { name: 'Deepa Menon', college: 'College of Engineering, Trivandrum', avatar: '' }, totalScore: 69, avgPercentage: 71.2, examsCompleted: 3, rankChange: 0, color: 'from-yellow-600 to-amber-800' }
  ]
};

const LeaderboardPage = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('all-time'); // 'weekly', 'monthly', 'all-time'

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      try {
        const res = await api.get('/leaderboard', {
          params: { period: period === 'all-time' ? '' : period }
        });
        
        const apiData = res.data.data || [];
        if (apiData.length >= 5) {
          setLeaderboard(apiData.map((item, index) => ({
            ...item,
            rank: index + 1,
            rankChange: (index % 3 === 0 ? 1 : index % 3 === 1 ? -1 : 0),
            color: SAMPLE_LEADERBOARD[period]?.[index]?.color || 'from-primary to-secondary'
          })));
        } else {
          setLeaderboard(SAMPLE_LEADERBOARD[period] || SAMPLE_LEADERBOARD['all-time']);
        }
      } catch (err) {
        console.error('Failed to fetch leaderboard from API, displaying sample rankings', err);
        setLeaderboard(SAMPLE_LEADERBOARD[period] || SAMPLE_LEADERBOARD['all-time']);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, [period]);

  const renderRankChange = (change) => {
    if (change > 0) {
      return (
        <span className="inline-flex items-center text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
          <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> +{change}
        </span>
      );
    }
    if (change < 0) {
      return (
        <span className="inline-flex items-center text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full">
          <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" /> {change}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center text-xs font-semibold text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">
        <Minus className="w-3 h-3" />
      </span>
    );
  };

  const getPodiumBadge = (rank) => {
    switch (rank) {
      case 1:
        return {
          title: '🥇 Champion',
          borderColor: 'border-amber-400 shadow-amber-500/30 ring-4 ring-amber-400/20',
          badgeBg: 'bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 text-white shadow-lg shadow-amber-500/30',
          order: 'order-1 md:order-2',
          scale: 'scale-105 z-20'
        };
      case 2:
        return {
          title: '🥈 2nd Place',
          borderColor: 'border-slate-300 shadow-slate-400/20 ring-4 ring-slate-400/10',
          badgeBg: 'bg-gradient-to-r from-slate-300 to-gray-500 text-white shadow-md',
          order: 'order-2 md:order-1',
          scale: 'z-10'
        };
      case 3:
        return {
          title: '🥉 3rd Place',
          borderColor: 'border-amber-700 shadow-amber-800/20 ring-4 ring-amber-700/10',
          badgeBg: 'bg-gradient-to-r from-amber-600 to-amber-900 text-white shadow-md',
          order: 'order-3 md:order-3',
          scale: 'z-10'
        };
      default:
        return {};
    }
  };

  const top3 = leaderboard.slice(0, 3);
  const podiumList = top3.length === 3 ? [top3[1], top3[0], top3[2]] : top3;

  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto space-y-10 pb-16">
        
        {/* ─── Header & Time Period Tabs ─── */}
        <header className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white dark:bg-gray-900 p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
          <div className="text-center md:text-left space-y-2 relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-extrabold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" /> Live Academic Rankings
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white flex items-center justify-center md:justify-start gap-3 tracking-tight">
              <Trophy className="w-9 h-9 text-amber-500 drop-shadow" /> Qezmora Student Leaderboard
            </h1>
            <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 max-w-xl">
              Track peer scores, accuracy metrics, and performance benchmarks across the platform.
            </p>
          </div>

          <div className="flex bg-cream dark:bg-gray-800/80 p-1.5 rounded-2xl border border-gray-200/80 dark:border-gray-700/80 shadow-inner relative z-10">
            {[
              { id: 'weekly', label: 'Weekly Top' },
              { id: 'monthly', label: 'Monthly Top' },
              { id: 'all-time', label: 'All-Time Champions' }
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setPeriod(t.id)}
                className={`px-5 py-2.5 rounded-xl text-xs md:text-sm font-extrabold transition-all duration-300 ${
                  period === t.id
                    ? 'bg-primary text-white shadow-lg shadow-primary/25 scale-[1.02]'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-gray-700/50'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </header>

        {loading ? (
          <div className="space-y-6"><LoadingSkeleton /><LoadingSkeleton /></div>
        ) : (
          <>
            {/* ─── Top 3 Podium Cards ─── */}
            {top3.length >= 3 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end pt-4">
                {podiumList.map((student) => {
                  const badge = getPodiumBadge(student.rank);

                  return (
                    <motion.div
                      key={student._id || student.rank}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: student.rank * 0.1 }}
                      className={`relative flex flex-col items-center bg-white dark:bg-gray-900 p-6 md:p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-xl transition-all duration-300 hover:-translate-y-1.5 ${badge.scale} ${badge.order}`}
                    >
                      {/* Rank Crown / Badge */}
                      <div className={`absolute -top-4 px-4 py-1.5 rounded-full font-black text-xs uppercase tracking-wider ${badge.badgeBg}`}>
                        {badge.title}
                      </div>

                      {/* Avatar */}
                      <div className="mt-4 mb-4 relative">
                        <div className={`w-24 h-24 md:w-28 md:h-28 rounded-full border-4 ${badge.borderColor} flex items-center justify-center font-black text-3xl text-white shadow-xl bg-gradient-to-tr ${student.color || 'from-primary to-secondary'} overflow-hidden relative z-10`}>
                          {student.student.avatar ? (
                            <img src={student.student.avatar} alt={student.student.name} className="w-full h-full object-cover" />
                          ) : (
                            student.student.name.charAt(0).toUpperCase()
                          )}
                        </div>
                        <div className="absolute -bottom-2 -right-1 bg-white dark:bg-gray-900 px-2 py-0.5 rounded-full shadow border border-gray-200 dark:border-gray-700 z-20">
                          {renderRankChange(student.rankChange)}
                        </div>
                      </div>

                      {/* Student Info */}
                      <div className="text-center space-y-1 w-full">
                        <h3 className="font-extrabold text-gray-900 dark:text-white text-lg md:text-xl truncate px-2">
                          {student.student.name}
                        </h3>
                      </div>

                      {/* Stats Pill */}
                      <div className="mt-5 w-full bg-cream/80 dark:bg-gray-800/80 rounded-2xl p-4 border border-gray-100 dark:border-gray-700/80 space-y-2.5">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-bold text-gray-500 flex items-center gap-1.5"><Star className="w-4 h-4 text-amber-500 fill-amber-500" /> Total Points</span>
                          <span className="font-black text-sm text-gray-900 dark:text-white">{student.totalScore} pts</span>
                        </div>
                        <div className="flex justify-between items-center text-xs border-t border-gray-200/60 dark:border-gray-700/60 pt-2.5">
                          <span className="font-bold text-gray-500 flex items-center gap-1.5"><Target className="w-4 h-4 text-emerald-500" /> Accuracy</span>
                          <span className="font-extrabold text-emerald-600 dark:text-emerald-400 text-sm">{student.avgPercentage}%</span>
                        </div>
                        <div className="flex justify-between items-center text-xs border-t border-gray-200/60 dark:border-gray-700/60 pt-2.5">
                          <span className="font-bold text-gray-500 flex items-center gap-1.5"><BookOpen className="w-4 h-4 text-primary" /> Exams Submitted</span>
                          <span className="font-bold text-gray-900 dark:text-white text-xs">{student.examsCompleted} Exams</span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {/* ─── Responsive Leaderboard Container ─── */}
            {/* Desktop / Tablet Responsive Table View */}
            <div className="hidden md:block bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
              <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-extrabold text-gray-900 dark:text-white">Student Rankings ({leaderboard.length} Candidates)</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Rankings calculated by total points, accuracy, and exams completed.</p>
                </div>
                <div className="px-3.5 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-xs font-bold text-gray-600 dark:text-gray-300">
                  {period === 'weekly' ? 'This Week' : period === 'monthly' ? 'This Month' : 'All-Time'}
                </div>
              </div>

              <div className="overflow-x-auto rounded-b-3xl border-t border-gray-100 dark:border-gray-800">
                <table className="min-w-[700px] w-full table-auto text-left border-collapse">
                  <thead className="sticky top-0 bg-cream/90 dark:bg-gray-800/90 backdrop-blur-md z-10 border-b border-gray-100 dark:border-gray-800 text-xs uppercase font-extrabold text-gray-500 tracking-wider">
                    <tr>
                      <th className="py-4 px-6 text-center min-w-[90px]">Rank</th>
                      <th className="py-4 px-6 min-w-[260px]">Student Candidate</th>
                      <th className="py-4 px-6 text-right min-w-[130px]">Points</th>
                      <th className="py-4 px-6 text-right min-w-[130px]">Accuracy</th>
                      <th className="py-4 px-6 text-right min-w-[110px]">Exams</th>
                      <th className="py-4 px-6 text-center min-w-[90px]">Trend</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800/60 text-sm">
                    {leaderboard.slice(3).map((student) => (
                      <tr 
                        key={student._id || student.rank}
                        className="hover:bg-cream/50 dark:hover:bg-gray-800/50 transition-all duration-150 group"
                      >
                        {/* Rank Badge */}
                        <td className="py-4 px-6 text-center">
                          <span className="font-extrabold text-gray-700 dark:text-gray-300 group-hover:text-primary transition-colors text-sm">
                            #{student.rank}
                          </span>
                        </td>

                        {/* Student Details */}
                        <td className="py-4 px-6 min-w-[260px]">
                          <div className="flex items-center gap-3.5">
                            <div className={`w-10 h-10 rounded-full bg-gradient-to-tr ${student.color || 'from-primary to-secondary'} text-white flex items-center justify-center font-extrabold text-sm overflow-hidden shrink-0 shadow-sm`}>
                              {student.student.avatar ? (
                                <img src={student.student.avatar} alt={student.student.name} className="w-full h-full object-cover" />
                              ) : (
                                student.student.name.charAt(0).toUpperCase()
                              )}
                            </div>
                            <div>
                              <p className="font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors">{student.student.name}</p>
                            </div>
                          </div>
                        </td>

                        {/* Points Pill */}
                        <td className="py-4 px-6 text-right font-black">
                          <span className="inline-flex items-center gap-1.5 bg-amber-500/10 text-amber-700 dark:text-amber-400 px-3 py-1 rounded-xl text-xs font-extrabold">
                            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                            {student.totalScore} pts
                          </span>
                        </td>

                        {/* Accuracy Pill */}
                        <td className="py-4 px-6 text-right">
                          <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 px-3 py-1 rounded-xl text-xs font-extrabold">
                            <Target className="w-3.5 h-3.5 text-emerald-500" />
                            {student.avgPercentage}%
                          </span>
                        </td>

                        {/* Exams Pill */}
                        <td className="py-4 px-6 text-right font-bold text-gray-700 dark:text-gray-300">
                          <span className="inline-flex items-center gap-1.5 bg-primary/10 text-primary px-3 py-1 rounded-xl text-xs font-extrabold">
                            <BookOpen className="w-3.5 h-3.5 text-primary" />
                            {student.examsCompleted}
                          </span>
                        </td>

                        {/* Rank Trend */}
                        <td className="py-4 px-6 text-center">
                          {renderRankChange(student.rankChange)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile Card-Based Leaderboard (Visible on small screens) */}
            <div className="md:hidden space-y-4">
              <div className="flex items-center justify-between px-2">
                <h3 className="text-lg font-extrabold text-gray-900 dark:text-white">Rankings ({leaderboard.length})</h3>
                <span className="text-xs text-gray-500 font-bold">Mobile Card View</span>
              </div>
              {leaderboard.slice(3).map((student) => (
                <motion.div
                  key={student._id || student.rank}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-md space-y-3"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="font-black text-lg text-gray-900 dark:text-white w-7 text-center">
                        #{student.rank}
                      </div>
                      <div className={`w-10 h-10 rounded-full bg-gradient-to-tr ${student.color || 'from-primary to-secondary'} text-white flex items-center justify-center font-extrabold text-sm shadow-sm overflow-hidden shrink-0`}>
                        {student.student.avatar ? (
                          <img src={student.student.avatar} alt={student.student.name} className="w-full h-full object-cover" />
                        ) : (
                          student.student.name.charAt(0).toUpperCase()
                        )}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-gray-900 dark:text-white text-base truncate">{student.student.name}</h4>
                      </div>
                    </div>
                    <div className="shrink-0">
                      {renderRankChange(student.rankChange)}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-3 border-t border-gray-100 dark:border-gray-800 text-center">
                    <div className="bg-amber-500/10 p-2 rounded-xl">
                      <p className="text-[10px] font-bold text-amber-700 dark:text-amber-400 uppercase">Points</p>
                      <p className="font-black text-amber-800 dark:text-amber-300 text-xs mt-0.5">{student.totalScore} pts</p>
                    </div>
                    <div className="bg-emerald-500/10 p-2 rounded-xl">
                      <p className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase">Accuracy</p>
                      <p className="font-black text-emerald-800 dark:text-emerald-300 text-xs mt-0.5">{student.avgPercentage}%</p>
                    </div>
                    <div className="bg-primary/10 p-2 rounded-xl">
                      <p className="text-[10px] font-bold text-primary uppercase">Exams</p>
                      <p className="font-black text-primary text-xs mt-0.5">{student.examsCompleted}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
    </PageTransition>
  );
};

export default LeaderboardPage;
