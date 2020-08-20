global.gtitle = 'Asw Panel'


global.db_prefix = 'asw_'
global.gdb = {

    name: 'njs1lisan',

    user: {
        table:      db_prefix+'users',
        id:         'user_id',
        username:   'user_username',
        password:   'user_password',
        email:      'user_email',
        fullname:   'user_fullname',
        status:     'user_status',
        level:      'user_level',
        create:     'user_create',
        update:     'user_update',
        lastlogin:  'user_lastlogin',
        more:       'user_more'
    },


    category: {
        table:          db_prefix+'categories',
        id:             'category_id',
        name:           'category_name',
        seflink:        'category_seflink',
        description:    'category_description',
        count:          'category_count',
        create:         'category_create',
        update:         'category_update'
    },

    post: {
        table:        db_prefix+'posts',
        id:           'post_id',
        type:         'post_type',
        title:        'post_title',
        seflink:      'post_seflink',
        description:  'post_description',
        content:      'post_content',
        cover:        'post_cover',
        tags:         'post_tags',
        user:         'post_user',
        status:       'post_status',
        order:        'post_order',
        parent:       'post_parent',
        create:       'post_create',
        update:       'post_update',
        more:         'post_more'
    },

    post_category: {
        table:          db_prefix+'post_category',
        id:             'post_category_id',
        category_id:    'category_id',
        post_id:        'post_id'
    },



    media: {
        table:      db_prefix+'media',
        id:         'media_id',
        title:      'media_title',
        seflink:    'media_seflink',
        description:'media_description',
        file:       'media_file',
        type:       'media_type',
        tags:       'media_tags',
        create:     'media_create'
    },

    contact: {
        table:    db_prefix+'contacts',
        id:       'contact_id',
        title:    'contact_title',
        author:   'contact_author',
        content:  'contact_content',
        datas:    'contact_datas',
        parent:   'contact_parent',
        type:     'contact_type',
        status:   'contact_status',
        create:   'contact_create',
        update:   'contact_update'
    },

    comment: {
        table:    db_prefix+'comments',
        id:       'comment_id',
        author:   'comment_author',
        post:     'comment_post',
        content:  'comment_content',
        datas:    'comment_datas',
        parent:   'comment_parent',
        status:   'comment_status',
        create:   'comment_create'
    },


} // gdb global database




global.gmedia = {

    allow_extensions: ['png', 'jpg', 'jpeg', 'gif', 'rar', 'zip', 'docx', 'pdf', 'txt', 'mp4', 'mp3']

}
