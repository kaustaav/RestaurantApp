const { CLIENT_ORIGIN } = require('../config/keys');

module.exports = {
    confirm: (id, type) => ({
        subject: 'React Confirm Email',
        html: `
            <a href='${CLIENT_ORIGIN}/api/${type}/confirm/${id}'>
                click to confirm email
            </a>
        `,
        text: `Copy and paste this link: ${CLIENT_ORIGIN}/confirm/${id}`
    }),
    forget_pass: (id, token) => ({
        subject: 'React Forget Password',
        html: `
            <a href='${CLIENT_ORIGIN}/api/users/reset_password?token=${token}&id=${id}'>
                click here to reset password
            </a>
        `,
        text: `Copy and paste this link: ${CLIENT_ORIGIN}/api/users/reset_password?token=${token}&id=${id}`
    })
}