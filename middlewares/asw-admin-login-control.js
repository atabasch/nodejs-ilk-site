let boolSession = (session)=>{
    return (typeof session.user != 'undefined');
}

module.exports = (request, response, next) => {
    request.session.user = {
        id: 9,
        username: 'atabas61',
        email: 'atabas61@gmail.com',
        level: 3,
        last_login: '2020-08-02T23:37:01.000Z'
      }
      request.session.save();
    if(request.originalUrl.indexOf('admin/login') > -1){ // Login sayfasındasın
        if(boolSession(request.session)==true){
            response.redirect('/admin');
        }
    }else{
        if(boolSession(request.session)!=true){    response.redirect('/admin/login');    }
    }
    next();
}
