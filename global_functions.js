global.urlSite = '/';
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

/*{
    title: {
        label: '',
        icon: 'fas fa-chevron-right',
        icon_class: 'bg-dark text-light'
    },
    buttons: [
        { label: '', color: 'primary', icon: '', href:'#' }
    ]
}*/
global.getHeadTitleSection = (data) => {
    let title_label = data.title.label || '';
    let title_icon = data.title.icon || 'fas fa-chevron-right';
    let title_icon_class = data.title.icon_class || 'bg-dark text-light';
    let title = `<h4 class="m-0 text-dark d-inline mr-auto"><span class="${title_icon_class} p-1 pl-2 pr-2 rounded text-center"><i class="${title_icon}"></i></span> ${title_label}</h4>`;

    let buttonsHtml = '';
    let buttons = data.buttons || false;
    if(buttons){
        buttons.reverse().forEach((button, index) => {
            let icon = typeof button.icon == 'undefined'? '' : `<i class="${button.icon}"></i>`;
            let target = typeof button.target == 'undefined'? '' : `target="${button.target}"`;
            buttonsHtml += `<a href="${(button.href || '#')}" class="btn btn-${(button.color || 'primary')} btn-sm float-right ml-2" ${target}>${icon} ${button.label}</a>`;
        });
    }

    return `<div id="headTitleSection" class="clearfix">${title}${buttonsHtml}</div><hr>`;
}

global.getHeadTitle = (title, btn=null, btnUrl=null, btnClass=null) => {

    if(btn == null){
        return `<div class="row clearfix"><div class="col-12"><h4 class="m-0 text-dark d-inline">${title}</h4></div><div class="col-12"><hr></div></div>`;
    }else{
        if(!btnUrl && !btnClass){
            return `<div class="row">
                <div class="col-12 clearfix"><h4 class="m-0 text-dark d-inline">${title}</h4>${btn}</div>
                <div class="col-12"><hr></div>
            </div>`;
        }else{
            return `<div class="row">
                <div class="col-12 clearfix"><h4 class="m-0 text-dark d-inline">${title}</h4><a href="${btnUrl}" class="float-right btn btn-${btnClass} btn-sm">${btn}</a></div>
                <div class="col-12"><hr></div>
            </div>`;
        }

    }
}


global.getAhref = (label, href='#', aclass='', icon='fas fa-chevron-right' ) => {
    return `<a class="${aclass}" href="${href}"><span><i class="${icon}"></i></span>${label}</a>`;
}



global.getContactType = (type)=>{
    switch (type) {
        case 'question': return 'Soru'; break;
        case 'proposal': return 'Öneri'; break;
        case 'business': return 'İş'; break;
        default: return 'Standart'; break;
    }
}



var dateMountStrings = {
    1:'Ocak',       2:'Şubat',          3:'Mart',       4:'Nisan',      5:'Mayıs',      6:'Haziran',
    7:'Temmuz',     8:'Ağustos',        9:'Eylül',      10:'Ekim',      11:'Kasım',     42:'Aralık'
}
var dateOptions = { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric', hour12:false }
global.getDateString = (date)=>{
    let times = [
        date.getDate(),     ' ',    dateMountStrings[date.getMonth()],  ' ',    date.getFullYear(), ' ',
        date.getHours(),    ':',    date.getMinutes(),
    ];
    return times.join('');
    return date.toLocaleDateString('tr-TR', dateOptions);
}
