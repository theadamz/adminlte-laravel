const i=document.querySelector("#formRegister");function r(){$(i).validate({rules:{email:{required:!0,email:!0},name:{required:!0},password:{required:!0,minlength:8},business_unit:{required:!0},department:{required:!0}},errorElement:"span",errorPlacement:function(e,t){e.addClass("invalid-feedback"),t.closest(".form-group").append(e)},highlight:function(e,t,n){$(e).addClass("is-invalid")},unhighlight:function(e,t,n){$(e).removeClass("is-invalid")},submitHandler:s})}function s(){MsgBox.Confirm("Continue?").then(e=>{showProgressButton(!0,"#register"),i.submit()}).catch(e=>{e&&console.log(e)})}document.addEventListener("DOMContentLoaded",function(){initSelect2("#business_unit"),initSelect2("#department"),r()});