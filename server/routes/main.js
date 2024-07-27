const express = require('express');
const router = express.Router();
const Post= require('../models/Post');



router.get('', async (req,res) => {
   
    try {
        const locals = {
            title : "NodeJs Blog",
            description: "Simple Blog"
        }



        let perPage = 2 ;
        let page = req.query.page || 1;

        const data = await Post.aggregate([{$sort:{createdAt:-1}}])
        .skip(perPage*page - perPage)
        .limit(perPage)
        .exec();

        const count = await Post.countDocuments();
        const nextPage= parseInt(page) + 1;
        const hasNextPage =  nextPage <= Math.ceil(count/perPage);


    
        
        res.render('index',
            {
                locals,
                data,
                current : page,
                nextPage : hasNextPage? nextPage : null,
                currentRoute: '/'

            }
        );
    } catch(error) {
        console.log(error);

    }
   
});










router.get('/about', (req,res) => {
    res.render('about',{
        currentRoute: `/about`});
});

router.get('/contact', (req,res) => {
    res.render('contact',{
        currentRoute: `/contact`});
});





router.get('/post/:id', async (req,res) => {
   

    try {

       
       let slug = req.params.id;
//       console.log(slug);

       const data = await Post.findById(slug);


        const locals = {
            title : data.title,
            description: "Simple Blog"
        }


        res.render('post',{locals,data, currentRoute: `/post/${slug}`});
    } catch(error) {
        console.log(error);

    }

});



router.post('/search', async (req,res) => {
   

    try {

        const locals = {
            title : "Search",
            description: "Simple Blog"
        }
        let searchTerm = req.body.searchTerm;
        const searchNoSpecialChar = searchTerm.replace(/[^a-zA-z0-9]/g,"");
        console.log(searchTerm);

        // res.send(searchTerm);

        const data = await Post.find({
            $or:[
                { title : { $regex : new RegExp(searchNoSpecialChar,'i')}},
                { body: { $regex : new RegExp(searchNoSpecialChar,'i')}}
            ]
        });


        res.render('search',{locals,data,currentRoute: `/post/${slug}`});
    } catch(error) {
        console.log(error);

    }
});
//
//
//function insertPostData() {
//    Post.insertMany([
//        {
//            title: "Building a blog",
//            body: "This is the body"
//        },
//
//        {
//            title: "Building a blog2",
//            body: "This is the body"
//        },
//
//        {
//            title: "Building a blog3",
//            body: "This is the body"
//        },
//    ])
//}

//insertPostData();


// router.get('', async (req,res) => {
//     const locals = {
//         title : "NodeJs Blog",
//         description: "Simple Blog"
//     }

//     try {
//         const data = await Post.find();
//         res.render('index',{locals,data});
//     } catch(error) {
//         console.log(error);

//     }
// });


module.exports = router;