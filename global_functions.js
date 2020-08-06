global.urlSite = process.env.SITE_URL+'/' || 'http://127.0.0.1:3000/';
global.urlPanel = urlSite+'admin/';

global.getUrl = (more)=>{
    return urlSite+more;
}

global.getUrlPanel = (more)=>{
    return urlPanel+more;
}

global.getUrlUpload = (file)=>{
    return getUrl('uploads/'+file);
}

global.fillPath = (more)=>{
    return __dirname;
}


global.getAlert = (title, message, color='success') => {
    let head = title? '<h4 class="alert-heading">'+title+'</h4>' : '';
    return `<div class="alert alert-${color} alert-dismissible fade show" role="alert">${head}
        <p class="p-0 m-0">${message}</p>
        <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
    </div>`;
}


global.getHeadTitle = (title, btn=null, btnUrl=null, btnClass=null) => {

    if(btn == null){
        return `<div class="row clearfix"><div class="col-12"><h3 class="m-0">${title}</h3></div><div class="col-12"><hr></div></div>`;
    }else{
        if(!btnUrl && !btnClass){
            return `<div class="row">
                <div class="col-12 clearfix"><h3 class="m-0 d-inline-block">${title}</h3>${btn}</div>
                <div class="col-12"><hr></div>
            </div>`;
        }else{
            return `<div class="row">
                <div class="col-12 clearfix"><h3 class="m-0 d-inline-block">${title}</h3><a href="${btnUrl}" class="float-right btn btn-${btnClass} btn-sm">${btn}</a></div>
                <div class="col-12"><hr></div>
            </div>`;
        }

    }
}
