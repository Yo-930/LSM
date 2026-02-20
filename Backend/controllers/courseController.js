import CourseModel from '../models/courseModel.js';
import uploadOnCloudinary from '../config/cloudinary.js';
import LectureModel from '../models/lectureModel.js';


export const createCourse = async(req,res) =>{
    try{
        const {title,category} = req.body;
        if(!title || !category){
            return res.status(400).json({message: 'Title and Category are required!'});
        }
        const course = await CourseModel.create({
            title,
            description,
            creator : req.userId,
        });
        res.status(201).json({message: 'Course Created Successfully!', course});
    }catch(error){
        res.status(500).json({message: 'Error creating course', error});
            console.log(error);
    }
}

export const getPublishedCourses = async(req,res) =>{
    try{
        const courses = await CourseModel.find({isPublished: true});
        
        if(!courses){
            return res.status(400).json({message: 'No courses found!'});
        }
        
        return res.status(200).json({courses});

    }catch(error){
        
        res.status(500).json({message: 'Error fetching courses', error});
        console.log(error);
    
    }
}

export const getCreatorCourses = async (req,res) =>{
    try{
        const userId = req.userId;

        
        const courses = await CourseModel.find({creator: userId});
        
        if(!courses){
            return res.status(400).json({message: 'No courses found!'});
        }
        
        return res.status(200).json({courses});
    
    }catch(error){
        
        res.status(500).json({message: 'Error fetching courses', error});
        console.log(error);
    
    }
}

export const editCourse = async(req,res) =>{
    try{
        const {courseId} = req.params;
        
        const {title,subTitle,description,category,level,isPublished,price} = req.body;
        
        const thumbnail = req.file ? await uploadOnCloudinary(req.file.path) : undefined;
        
        let course = await CourseModel.findById(courseId);
        
        if(!course){
            return res.status(400).json({message: 'Course not found!'});
        }

        const updatedCourse = await CourseModel.findByIdAndUpdate(courseId, {
            title,
            subTitle,
            description,
            category,
            level,
            isPublished,
            price,
            thumbnail
        }, {new: true});

        if(!updatedCourse){
            return res.status(400).json({message: 'Course not found!'});
        }
        res.status(200).json({message: 'Course updated successfully!', updatedCourse});

    }catch(error){
        res.status(500).json({message: 'Error updating course', error});
        console.log(error);
    }
}

export const getCourseById = async(req,res) =>{
    try{
        const {courseId} = req.params;
        const course = await CourseModel.findById(courseId).populate('creator', 'name').populate('reviews').populate('lectures');
       
        if(!course){
            return res.status(400).json({message: 'Course not found!'});
        }
       
        return res.status(200).json({course});
    
    }catch(error){
        res.status(500).json({message: 'Error fetching course', error});
        console.log(error);
    }
}

export const deleteCourse = async(req,res) =>{
    try{
        const {courseId} = req.params;
        const course = await CourseModel.findByIdAndDelete(courseId, {new: true});
        
        if(!course){
            return res.status(400).json({message: 'Course not found!'});
        }

        return res.status(200).json({message: 'Course deleted successfully!'});
    
    }catch(error){

        res.status(500).json({message: 'Error deleting course', error});
        console.log(error);
    
    }
}
//for adding lectures to course

export const createLecture = async(req,res) =>{
    try{
        const {lectureTitle, videoUrl, isPreviewFree} = req.body;
        const {courseId} = req.params;

        if(!lectureTitle || !courseId){
            return res.status(400).json({message: 'Lecture title and course ID are required!'});
        }

        const lecture = await LectureModel.create({
            lectureTitle
        })
        
        const course = await CourseModel.findById(courseId);

        if(!course){
            return res.status(400).json({message: 'Course not found!'});
        }

        if(course){
            course.lectures.push(lecture._id);
        }

        await course.populate('lectures');
        await course.save();

        return res.status(201).json({message: 'Lecture created and added to course successfully!', lecture, course});
    }catch(error){
        res.status(500).json({message: 'Error creating lecture', error});
        console.log(error);
    }
}

export const getCourseLecture = async(req,res) =>{
    try{
        const {courseId} = req.params;
        const course = await CourseModel.findById(courseId);
        if(!course){
            return res.status(400).json({message: 'Course not found!'});
        }
        
        await course.populate('lectures');
        await course.save();

        return res.status(200).json({course});
    }catch(error){
        res.status(500).json({message: 'Error fetching lectures', error});
        console.log(error);
    }
}

export const editLecture = async(req,res) =>{
    try{
        const {lectureId} = req.params;
        const{lectureTitle,isPreviewFree} = req.body;

        const lecture = await LectureModel.findById(lectureId);

        if(!lecture){
            return res.status(400).json({message: 'Lecture not found!'});
        }

        let videoUrl;
        
        if(req.file){
            videoUrl = await uploadOnCloudinary(req.file.path);
            lecture.videoUrl = videoUrl;
        }

        if(lectureTitle){
            lecture.lectureTitle = lectureTitle;
        }

        lecture.isPreviewFree = isPreviewFree;

        await lecture.save();

        return res.status(200).json({message: 'Lecture updated successfully!', lecture});

    }catch(error){
        res.status(500).json({message: 'Error updating lecture', error});
        console.log(error);
    }
}

export const removeLecture = async(req,res) =>{
    try{
        const{lectureId} = req.params;  
        const lecture = await LectureModel.findByIdAndDelete(lectureId, {new: true});

        if(!lecture){
            return res.status(400).json({message: 'Lecture not found!'});
        }

        await CourseModel.updateOne({
            lectures: lectureId
        }, {
            $pull: {lectures: lectureId}
        })

        return res.status(200).json({message: 'Lecture removed successfully!'});
    }catch(error){
        res.status(500).json({message: 'Error removing lecture', error});
        console.log(error);
    }
}