import {
    axiosCustom,
    dateTimeFormat,
    formValidationSetErrorMessages,
    initMaxLength,
    MsgBox,
    refactorErrorMessages,
    showProgressButton,
} from '../../general';

const formElement = document.querySelector('#formInput');

function initFormValidation() {
    _formValidation = $(formElement).validate({
        rules: {
            email: {
                required: true,
                email: true
            },
            name: {
                required: true,
            },
        },
        submitHandler: saveData
    });
}

function initLengthInput() {
    initMaxLength('#email');
    initMaxLength('#name');
}

function initOtherElements() {
    getData();
}

function saveData() {
    MsgBox.Confirm('Are you sure want to save the changes?').then(result => {
        showProgressButton(true, '#save');
        _data2Send = $('#formInput').serialize();
        axiosCustom(`${_baseURL}/change-profile`, 'POST', _data2Send).then((response) => {
            if ([200].includes(response.status)) {
                Toast.fire({
                    icon: 'success',
                    title: response.statusText,
                    text: response.data.message
                });
                setTimeout(() => {
                    window.location.reload();
                }, 500);
            } else {
                MsgBox.HtmlNotification(refactorErrorMessages(response.data), `${response.status} - ${response.statusText}`);
                formValidationSetErrorMessages(response.data.errors);
            }
            showProgressButton(false, '#save');
        }).catch((err) => {
            MsgBox.Notification(err.toString());
            showProgressButton(false, '#save');
        });
    }).catch(err => {
        if (err) console.log(err);
    });
}

function getData() {
    axiosCustom(`${_baseURL}/profile`, 'GET').then((response) => {
        if ([200].includes(response.status)) {
            const data = response.data.data;
            $('#email').val(data.email);
            $('#name').val(data.name);
            $('#timezone option[value="' + data.timezone + '"]').prop('selected', true).change();
            $('#last_sign_in').val(dateTimeFormat(data.last_sign_in));
            $('#last_update').val(dateTimeFormat(data.updated_at));
            $('#last_change_password').val(data.last_change_password_at ? dateTimeFormat(data.last_change_password_at) : 'Never');
        } else {
            MsgBox.HtmlNotification(refactorErrorMessages(response.data), `${response.status} - ${response.statusText}`)
        }
    }).catch(err => {
        if (err) console.log(err);
    });
}

document.addEventListener("DOMContentLoaded", function () {
    initLengthInput();
    initFormValidation();
    initOtherElements();
});
