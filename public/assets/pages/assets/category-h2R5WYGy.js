import{b as h,i as v,a as T,v as g,c as b,e as u,M as i,s as l,f as c,r as d,g as p,h as s,_ as x,l as n,w as S}from"./general-DAK3ebw_.js";let f=null;const y=document.querySelector("#formInput");let m=null;const w=document.querySelector("#formImport");function k(){_dataTable=$("#list_datatable").DataTable({lengthMenu:[[10,25,50,100,-1],[10,25,50,100,"All"]],pageLength:50,numbers_length:4,searchDelay:500,processing:!0,serverSide:!0,scrollX:!0,stateSave:_dataTableUseState,stateDuration:_dataTableStateDuration,scrollY:_dataTableScrollY,order:[[0,"asc"]],select:{items:"row",style:"single",className:"bg-warning"},headerCallback:function(t,e,a,o,U){t.getElementsByTagName("th")[0].innerHTML=`
            <div class="form-check">
               <input class="form-check-input datatable-group-checkable" type="checkbox" value="" id="groupCheckable" />
					<label class="form-check-label"></label>
            </div>`},createdRow:function(t,e,a){_dataTableSelectedValues.indexOf(e[_dataTableSelectColumn])>-1&&$(t).addClass("bg-light")},ajax:{url:`${_baseURL}/dt/configs/inventories/categories`,type:"GET",data:function(t){t.is_active=$("#filter_is_active").val()}},columns:[{data:"id",width:"30px",orderable:!1,searchable:!1,render:function(t,e,a,o){return`<div class="form-check">
                               <input class="form-check-input datatable-checkable" type="checkbox" value="${t}" ${_dataTableSelectedValues.indexOf(t)>-1?"checked":""} data-index="${o.row}" />
                                        <label class="form-check-label"></label>
                            </div>`}},{data:"code"},{data:"code_as"},{data:"name",render:function(t,e,a,o){return`<span class="label" style="background-color:${a.tag_color}">${t}</span>`}},{data:"description"},{data:"is_active",className:"dt-center",searchable:!1,render:function(t,e,a,o){return h(t)?'<span class="badge font-weight-normal badge-success">Yes</span>':'<span class="badge font-weight-normal badge-warning">No</span>'}}]}).on("xhr.dt",function(t,e,a,o){setTimeout(()=>{_dataTable.columns.adjust()},300)}).on("draw.dt",function(t,e,a,o){v(_dataTable)}),T(_dataTable,'input[type="search"]'),document.querySelector("#refresh").addEventListener("click",()=>r(!1)),document.querySelector("#filterReset").addEventListener("click",V),document.querySelector("#formFilter").addEventListener("submit",t=>{t.preventDefault(),r(),$("#modalFormFilter").modal("hide")})}function E(){_formValidation=$(y).validate({rules:{code:{required:!0,regex:g},code_as:{required:!0,regex:g},name:{required:!0},tag_color:{required:!0}},submitHandler:I}),m=$(w).validate({rules:{file:{required:!0,accept:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",extension:"xlsx",filesize:2048}},submitHandler:R})}function L(){$("#modalFormInput").on("hidden.bs.modal",_),b("#modalFormInput"),$(".tag-color").colorpicker(),$(".tag-color").on("colorpickerChange",function(t){$(".tag-color .fa-square").css("color",t.color.toString())}),b("#modalFormImport"),document.getElementById("export").addEventListener("click",N)}function F(){_permissions.edit&&document.querySelector("#edit").addEventListener("click",()=>{typeof _dataTable.row({selected:!0}).data()>"u"||C(_dataTable.row({selected:!0}).data().id.trim())}),_permissions.delete&&document.querySelector("#delete").addEventListener("click",q)}function D(){u("#code"),u("#code_as"),u("#name"),u("#description")}function I(){i.Confirm("Are you sure?").then(t=>{l(!0,"#save"),f=`${_baseURL}/configs/inventories/categories`,_action==="edit"&&(f+=`/${_id}`);const e=_action==="create"?"POST":"PUT",a=$("#is_active").is(":checked")?"":"&is_active=false";_data2Send=$("#formInput").serialize()+a,c(f,e,_data2Send).then(o=>{[201,200].includes(o.status)?(_action="create",Toast.fire({icon:"success",title:o.statusText,text:o.data.message}),_(),r(!1),$("#modalFormInput").modal("hide")):(i.HtmlNotification(d(o.data),`${o.status} - ${o.statusText}`),p(o.data.errors)),l(!1,"#save")}).catch(o=>{i.Notification(o.toString()),l(!1,"#save")})}).catch(t=>{t&&console.log(t)})}function C(t=null){_id=t,s("#list_datatable"),c(`${_baseURL}/configs/inventories/categories/${_id}`,"GET",null).then(e=>{if([200].includes(e.status)){_(),_action="edit";const a=e.data.data;$("#code").val(a.code),$("#code_as").val(a.code_as),$("#name").val(a.name),$("#tag_color").val(a.tag_color),$(".tag-color .fa-square").css("color",a.tag_color),$("#description").val(a.description),$("#is_active").prop("checked",h(a.is_active)),$("#modalFormInput").modal("show")}else i.HtmlNotification(d(e.data),`${e.status} - ${e.statusText}`);s("#list_datatable",!1)}).catch(e=>{i.Notification(e.toString()),s("#list_datatable",!1)})}function q(){if(_dataTableSelectedValues.length<=0){i.HtmlNotification("Select 1 atau more data.");return}i.Confirm(`Are you sure want to delete ${_dataTableSelectedValues.length} data?`,null,"warning").then(t=>{l(!0,"#delete"),s("#list_datatable"),_data2Send=new URLSearchParams({id:JSON.stringify(_dataTableSelectedValues)}),c(`${_baseURL}/configs/inventories/categories`,"DELETE",_data2Send).then(e=>{[200].includes(e.status)?(Toast.fire({icon:"success",title:e.statusText,text:e.data.message}),x(),r(!1)):i.HtmlNotification(d(e.data),`${e.status} - ${e.statusText}`),l(!1,"#delete"),s("#list_datatable",!1)}).catch(e=>{i.Notification(e.toString()),l(!1,"#delete"),s("#list_datatable",!1)})}).catch(t=>{t&&console.log(t)})}async function N(){if(!await i.Confirm("Are you sure?").catch(a=>{a&&console.log(a)}))return;n(!0,"Please wait","Processing data...");const e=await c(`${_baseURL}/configs/inventories/categories/exports`,"POST",{is_active:$("#filter_is_active").val()},"application/json");if(![200].includes(e.status)){i.HtmlNotification(d(e.data),`${e.status} - ${e.statusText}`);return}S(e.data.url),n(!1)}function r(t=!0){_dataTableResetFilter=!1,_dataTable.ajax.reload(null,t)}function _(){_action="create",_data2Send=null,_formValidation.resetForm(),$("#formInput")[0].reset(),$("#is_active").prop("checked",!0)}function V(){$('#filter_is_active option[value=""]').prop("selected",!0).change(),$("#formFilter")[0].reset()}async function R(){if(!await i.Confirm("Are you sure?").catch(a=>{a&&console.log(a)}))return;$("#upload_info").val(null),l(!0,"#upload"),n(!0),_data2Send=new FormData($("#formImport")[0]);const e=await c(`${_baseURL}/configs/inventories/categories/imports`,"POST",_data2Send,null);if(![201].includes(e.status)){l(!1,"#upload"),n(!1),i.HtmlNotification(d(e.data),`${e.status} - ${e.statusText}`),p(e.data.errors,m),$("#upload_info").val(e.data.info);return}l(!1,"#upload"),n(!1),Toast.fire({icon:"success",title:e.statusText,text:e.data.message}),$("#upload_info").val(e.data.info),M(),r(!1),$("#modalFormInput").modal("hide")}function M(){_data2Send=null,m.resetForm(),$("#file").next().html("Choose file"),$("#file").val("")}document.addEventListener("DOMContentLoaded",function(){k(),E(),L(),D(),F()});