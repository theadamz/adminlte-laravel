const s=document.querySelector("#formResetPassword");function t(){$(s).validate({rules:{password_new:{required:!0,minlength:8},password_confirm:{required:!0,minlength:8,equalTo:"#password_new"}},errorElement:"span",errorPlacement:function(e,n){e.addClass("invalid-feedback"),n.closest(".form-group").append(e)},highlight:function(e,n,o){$(e).addClass("is-invalid")},unhighlight:function(e,n,o){$(e).removeClass("is-invalid")},submitHandler:i})}function i(){MsgBox.Confirm("Continue?").then(e=>{showProgressButton(!0,"#send"),s.submit()}).catch(e=>{e&&console.log(e)})}document.addEventListener("DOMContentLoaded",function(){t()});
