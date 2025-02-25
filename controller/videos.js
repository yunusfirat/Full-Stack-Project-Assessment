import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { v4: uuidv4 } = require("uuid");
const youTubeVideos = require("../data/videos.json");



export const order = (req, res, next) => {
    let order = req.query.order;
    if (order === 'asc') {
        const orderByAsc = youTubeVideos.sort((a, b) => { return a.rating - b.rating })
        return res.json(orderByAsc)
    } else if (order === 'desc') {
        const orderByDesc = youTubeVideos.sort((a, b) => { return b.rating - a.rating })
        return res.json(orderByDesc)
    }
    next()
}


export const getVideos = (req, res) => {
    return res.json(youTubeVideos)
}


export const postVideos = (req, res) => {
    const date = new Date()
    const newVideo = {
        id: uuidv4(),
        title: req.body.title,
        url: req.body.url,
        rating: 0,
        date: `${date.toLocaleTimeString()} - ${date.toLocaleDateString()}`
    }
    if (!newVideo.title || !newVideo.url) {
        return res.status(400).json({ msg: "please make sure that you have all field" });
    } else if (!newVideo.url.includes("youtube.com")) {
        return res.status(400).json({ msg: "please make sure you have added youtube videos" })
    }
    youTubeVideos.push(newVideo)
    return res.status(200).json(newVideo)
}

export const remove = (req, res) => {
    let temp;
    for (let i = 0; i < youTubeVideos.length; i++) {
        if (youTubeVideos[i].id.toString() === req.params.id) {
            temp = youTubeVideos[i];
            youTubeVideos.splice(i, 1);
            return res.status(200).json(youTubeVideos)
        }
    }
    if (temp === undefined) {
        return res.status(404).send(`The video ${req.params.id} is not exist`);
    } else {
        return res.status(200).send(`The video ${req.params.id} has been deleted`);
    }
};

export const search = (req, res) => {
    let title = req.query.title.toLowerCase();
    if (title) {
        const titlefound = youTubeVideos.some(video => video.title.toLowerCase().includes(title)
            || video.title.toLowerCase().includes(title))
        if (titlefound) {
            return res.status(200).json(youTubeVideos.filter(video => video.title.toLowerCase().includes(title)
                || video.title.toLowerCase().includes(title)))
        } else {
            return res.status(400).json({ msg: `No videos with the title of ${title}` });
        }
    }
}
