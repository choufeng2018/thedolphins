export default {
    layout: [{
        name: 'name',
        label: '名称',
        desc: '名称',
        align: 'right',
        fieldColumn: true,
        type: 'input',
        placeholder: '名称不能为空',
        required: true,
        invalid: true,
        minlength: 2,
        maxlength: 20
    },{
        name: 'flag',
        label: '标识',
        desc: '标识',
        align: 'right',
        fieldColumn: true,
        type: 'input',
        placeholder: '名称不能为空,只能为英文字符',
        required: true,
        invalid: true,
        minlength: 2,
        maxlength: 20
    }]
}