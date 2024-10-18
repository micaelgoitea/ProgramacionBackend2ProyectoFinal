const accessDeniedResponse = (role) => `
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <title>Acceso Denegado</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f8d7da;
                color: #721c24;
                text-align: center;
                padding: 50px;
            }
            h1 {
                font-size: 24px;
            }
            p {
                font-size: 18px;
            }
        </style>
    </head>
    <body>
        <h1>Acceso Denegado</h1>
        <p>Solo el rol ${role} tiene permiso para entrar a esta sección.</p>
    </body>
    </html>
`;

export function adminOnly(req, res, next) {
    if (req.user.role === "admin") {
        return next();
    }
    res.status(403).send(accessDeniedResponse("admin"));
}

export function userOnly(req, res, next) {
    if (req.user.role === "user") {
        return next();
    }
    res.status(403).send(accessDeniedResponse("user"));
}