import{f as o}from"./application-BtXPZOJh.js";import{h as i,d as _,p as r,e as d,M as f,s as l,l as p,q as m,f as g,r as v,g as b}from"./general-DAK3ebw_.js";const x=document.querySelector("#formInput");function y(){_formValidation=$(x).validate({rules:{user_name:{required:!0},subject:{required:!0},request_category:{required:!0},asset_category:{required:$("#include_asset").val()=="true"},asset:{required:$("#include_asset").val()=="true"},entity:{required:!0},site:{required:!0},building:{required:!0}},submitHandler:function(n,t){t.preventDefault(),$(n).valid()&&L()}})}function w(){i(".ticket-main-container"),_("#detail_description","detail_description",200),$("#ticket_behalf").on("select2:select",function(n){const t=n.params.data;$("#department").val(t.department.name),T()}),$(".detail-description-button-insert-content").on("click",function(){const n=$(this).data("value");tinymce.activeEditor.execCommand("mceInsertContent",!1,`<strong>${n}</strong>`)}),$("#request_category").on("select2:select",function(n){const t=n.params.data;$(".category-description").html(t.description)}),$("#include_asset").on("change",function(){const n=$(this).val()!="true";_formValidation.resetForm(),$("#asset_category").prop("disabled",n),$("#asset").prop("disabled",n)}),$("#asset_category").on("change",function(){$(this).val()&&($("#asset").val(null).empty().trigger("change"),$("#site").val(null),$("#building").val(null))}),$("#asset").on("select2:select",function(n){const t=n.params.data;$("#asset_info_site").val(t.site_name),$("#asset_info_building").val(t.building_name)}),$("#entity").on("change",function(){$(this).val()&&(o("#site",`${_baseURL}/s2/configs/setups/sites/${$(this).val()}`,ticketLocation.site_id),$("#site").val(null).empty().trigger("change"),$("#building").val(null).empty().trigger("change"))}),$("#site").on("change",function(){$(this).val()&&o("#building",`${_baseURL}/s2/configs/setups/buildings/${$(this).val()}`,ticketLocation.building_id)}),o("#site",`${_baseURL}/s2/configs/setups/sites/${ticketLocation.entity_id}`,ticketLocation.site_id),i(".ticket-main-container",!1)}function S(){const n=function(e){return e.id?e.id==user.id?"No results found":`<div class="d-flex flex-column">
                    <span class="font-weight-bold">${e.name}</span>
                    <span class="font-weight-light">${e.department.name}</span>
                    <span class="font-weight-light${e.email==e.username?" d-none":""}">${e.username}</span>
                    <span class="font-weight-light">${e.email}</span>
                </div>`:e.text},t=function(e){return e.id&&e.text||!e.id?e.text:`<div class="d-flex">
                    <span class="font-weight-bold mr-1">${e.name}</span>
                    <span class="font-weight-light">(${e.email})</span>
                </div>`};if(r("#ticket_behalf","Select",`${_baseURL}/s2/configs/users`,2,n,t),userBehalf){const e=new Option(t(userBehalf),userBehalf.id,!0,!0);$("#ticket_behalf").append(e).trigger("change")}const a=function(e){return e.id?`<div class="d-flex flex-column">
                    <span class="font-weight-bold">${e.name}</span>
                    <span class="font-weight-light">${e.description}</span>
                </div>`:e.text},s=function(e){return e.id&&e.text||!e.id?e.text:`${e.name}`};if(r("#request_category","Select",`${_baseURL}/s2/configs/helpdesks/categories?ticket_purpose=${purposeId}`,0,a,s),requestCategory){const e=new Option(s(requestCategory),requestCategory.id,!0,!0);$("#request_category").append(e).trigger("change"),$(".category-description").html(requestCategory.description)}const c=function(e){return e.id?e.id==user.id?"No results found":`<div class="d-flex flex-column">
                    <span class="font-weight-bold">${e.name}</span>
                    <span class="font-weight-light">${e.department.name}</span>
                    <span class="font-weight-light${e.email==e.username?" d-none":""}">${e.username}</span>
                    <span class="font-weight-light">${e.email}</span>
                </div>`:e.text},u=function(e){return e.id&&e.text||!e.id?e.text:`${e.username}`};if(r("#inform_users","Select",`${_baseURL}/s2/configs/users`,2,c,u,!1,!0),informUsers){for(const e of informUsers){const h=new Option(u(e),e.id,!1,!0);$("#inform_users").append(h)}$("#inform_users").trigger("change")}}function k(){const n=function(s){return s.id?`<div class="d-flex flex-column">
                    <span class="font-weight-bold">${s.asset_alias_id}</span>
                    <span class="font-weight-light">${s.asset_name}</span>
                    <span class="font-weight-light">${s.type}</span>
                    <span class="font-weight-light">${s.site_name} - ${s.building_name}</span>
                </div>`:s.text},t=function(s){return s.id&&s.text||!s.id?s.text:`<div class="d-flex">
                    <span class="font-weight-bold mr-1">${s.asset_alias_id}</span>
                    <span class="font-weight-light">(${s.asset_name})</span>
                </div>`};$("#asset").select2({dropdownParent:null,theme:"bootstrap4",placeholder:"Select",minimumInputLength:2,multiple:!1,allowClear:!1,closeOnSelect:!0,ajax:{url:`${_baseURL}/s2/inventories/assets`,type:"GET",dataType:"json",delay:400,data:function(s){return{keyword:s.term,asset_category:$("#asset_category").val()}},processResults:function(s,c){return{results:s.data}},cache:!0},escapeMarkup:function(s){return s},templateSelection:t,templateResult:n});const a=new Option(t(userAsset),userAsset.id,!0,!0);$("#asset").append(a).trigger("change")}function q(){d("#phone_ext"),d("#subject")}async function L(){if(!await f.Confirm("Are you sure want to save?").catch(a=>{a&&console.log(a)}))return;l(!0,"#save"),p(!0,"Please wait","Saving..."),_data2Send=m($("#formInput").serialize(),!1),_data2Send.inform_users=$("#inform_users").val();const t=await g($("#formInput").attr("action"),"POST",_data2Send,"application/json");if(![200].includes(t.status)){f.HtmlNotification(v(t.data),`${t.status} - ${t.statusText}`),b(t.data.errors),l(!1,"#save");return}l(!1,"#save"),p(!1),Toast.fire({icon:"success",title:t.statusText,text:t.data.message})}async function T(){i(".ticket-asset-information");const n=await g(`${_baseURL}/assets/${$("#ticket_behalf").val()}`,"GET");if(![200].includes(n.status))return;const t=n.data.data;if(t){const a=new Option(`<div class="d-flex">
                <span class="font-weight-bold mr-1">${t.asset_alias_id}</span>
                <span class="font-weight-light">(${t.asset_name})</span>
            </div>`,t.id,!0,!0);$('#asset_category option[value="'+t.asset_category_id+'"]').prop("selected",!0).change(),$("#asset").append(a).trigger("change"),$("#asset_info_site").val(t.site_name),$("#asset_info_building").val(t.building_name)}else $('#asset_category option[value=""]').prop("selected",!0).change(),$("#asset").val(null).empty().trigger("change"),$("#asset_info_site").val(null),$("#asset_info_building").val(null);i(".ticket-asset-information",!1)}document.addEventListener("DOMContentLoaded",function(){y(),q(),S(),k(),w()});