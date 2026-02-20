import express from 'express';
import { upload } from '../middleware/multer.js';
import { createCourse,getPublishedCourses,getCreatorCourses,editCourse,getCourseById } from '../controllers/courseController';
import { isAuthenticated } from '../middleware/authMiddleware';
import { createLecture,getCourseLecture,editLecture,removeLecture } from '../controllers/courseController';

const courseRouter = express.Router();

courseRouter.post('/create',isAuthenticated,createCourse);
courseRouter.get('/getpublished', getPublishedCourses);
courseRouter.get('/getcreator', isAuthenticated, getCreatorCourses);
courseRouter.post('/editcourse/:courseId', isAuthenticated, upload.single('thumbnail'), editCourse);
courseRouter.get('/getcoursebyid/:courseId', isAuthenticated, getCourseById);

//for lectures-----------

courseRouter.post('/createlecture/:courseId', isAuthenticated,createLecture);
courseRouter.get('/getlectures/:courseId', isAuthenticated, getCourseLecture);
courseRouter.post('/editlecture/:lectureId', isAuthenticated, upload.single('videoUrl'), editLecture);
courseRouter.post('/removelecture/:lectureId', isAuthenticated, removeLecture);   

export default courseRouter;