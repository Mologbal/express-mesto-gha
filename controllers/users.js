const User = require('../models/user');

//список необходимых видов ошибок
const DEFAULT_ERROR = 500;
const NOT_FOUND_ERROR = 404;
const BAD_REQUEST_ERROR = 400;

//создать пользователя
const createUser = async (req, res) => {
    const {name, about, avatar} = req.body;
    try {
        const user = await User.create({name, about, avatar});
        return res
            .status(200)
            .send(user);
    } catch (err) {
        if (err.name === 'ValidationError') {
            return res
                .status(BAD_REQUEST_ERROR)
                .send({
                    message: 'Переданы некорректные данные в методы создания карточки, пользователя, обновле' +
                                'ния аватара пользователя или профиля'
                });
        }
        return res
            .status(DEFAULT_ERROR)
            .send({message: 'С сервером что-то не так :('});
    }
};

//получить список всех пользователей
const getUser = async (req, res) => {
    try {
        const users = await User.find({});
        return res
            .status(200)
            .send(users);
    } catch (err) {
        return res
            .status(DEFAULT_ERROR)
            .send({message: 'С сервером что-то не так :('});
    }
};

//получить пользователя по ID
const getUserId = async (req, res) => {
    const {userId} = req.params;
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res
                .status(NOT_FOUND_ERROR)
                .send({message: 'Такого пользователя не существует'});
        }
        return res
            .status(200)
            .send(user);
    } catch (err) {
        if (err.name === 'CastError') {
            return res
                .status(BAD_REQUEST_ERROR)
                .send({message: 'Некорректные данные пользователя'});
        }
        return res
            .status(DEFAULT_ERROR)
            .send({message: 'Ошибка на сервере'});
    }
};

//обновить данные пользователя
const updateUser = async (req, res) => {
    const {name, about} = req.body;
    const id = req.user._id;
    try {
        const user = await User.findByIdAndUpdate(id, {
            name,
            about
        }, {
            new: true,
            runValidators: true
        });
        if (!user) {
            return res
                .status(BAD_REQUEST_ERROR)
                .send({
                    message: 'Переданы некорректные данные в методы создания карточки, пользователя, обновле' +
                                'ния аватара пользователя или профиля'
                });
        }
        return res
            .status(200)
            .send(user);
    } catch (errors) {
        if (errors.name === 'ValidationError') {
            return res
                .status(BAD_REQUEST_ERROR)
                .send({
                    message: 'Переданы некорректные данные в методы создания карточки, пользователя, обновле' +
                                'ния аватара пользователя или профиля'
                });
        }
        return res
            .status(DEFAULT_ERROR)
            .send({message: 'С сервером что-то не так :('});
    }
};

//обновить аватарку пользователя
const updateAvatar = async (req, res) => {
    const {avatar} = req.body;
    const id = req.user._id;
    try {
        const user = await User.findByIdAndUpdate(id, {
            avatar
        }, {
            new: true,
            runValidators: true
        });
        if (!user) {
            return res
                .status(BAD_REQUEST_ERROR)
                .send({
                    message: 'Переданы некорректные данные в методы создания карточки, пользователя, обновле' +
                                'ния аватара пользователя или профиля'
                });
        }
        return res
            .status(200)
            .send(user);
    } catch (errors) {
        if (errors.name === 'ValidationError') {
            return res
                .status(BAD_REQUEST_ERROR)
                .send({
                    message: 'Переданы некорректные данные в методы создания карточки, пользователя, обновле' +
                                'ния аватара пользователя или профиля'
                });
        }
        return res
            .status(DEFAULT_ERROR)
            .send({message: 'С сервером что-то не так :( '});
    }
};

module.exports = {
    createUser,
    getUser,
    getUserId,
    updateUser,
    updateAvatar
};
