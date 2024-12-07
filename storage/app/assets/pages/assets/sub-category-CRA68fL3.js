import{b,i as p,a as v,v as T,c as g,e as u,M as l,s as o,f as c,r as d,g as h,h as s,_ as x,l as n}from"./general-DAK3ebw_.js";let f=null;const S=document.querySelector("#formInput");let m=null;const y=document.querySelector("#formImport");function w(){_dataTable=$("#list_datatable").DataTable({lengthMenu:[[10,25,50,100,-1],[10,25,50,100,"All"]],pageLength:50,numbers_length:4,searchDelay:500,processing:!0,serverSide:!0,scrollX:!0,stateSave:_dataTableUseState,stateDuration:_dataTableStateDuration,scrollY:_dataTableScrollY,order:[[0,"asc"]],select:{items:"row",style:"single",className:"bg-warning"},headerCallback:function(t,e,a,i,M){t.getElementsByTagName("th")[0].innerHTML=`
          <div class="form-check">
             <input class="form-check-input datatable-group-checkable" type="checkbox" value="" id="groupCheckable" />
        <label class="form-check-label"></label>
          </div>`},createdRow:function(t,e,a){_dataTableSelectedValues.indexOf(e[_dataTableSelectColumn])>-1&&$(t).addClass("bg-light")},ajax:{url:`${_baseURL}/dt/configs/inventories/sub-categories`,type:"GET",data:function(t){t.category=$("#filter_category").val(),t.is_active=$("#filter_is_active").val(),t.lcns_id=$("#filter_lcn").val()}},columns:[{data:"id",width:"30px",orderable:!1,searchable:!1,render:function(t,e,a,i){return`<div class="form-check">
                             <input class="form-check-input datatable-checkable" type="checkbox" value="${t}" ${_dataTableSelectedValues.indexOf(t)>-1?"checked":""} data-index="${i.row}" />
                                      <label class="form-check-label"></label>
                          </div>`}},{data:"code"},{data:"name"},{data:"description"},{data:"is_active",className:"dt-center",searchable:!1,render:function(t,e,a,i){return b(t)?'<span class="badge font-weight-normal badge-success">Yes</span>':'<span class="badge font-weight-normal badge-warning">No</span>'}},{data:"asset_category.name"}]}).on("xhr.dt",function(t,e,a,i){setTimeout(()=>{_dataTable.columns.adjust()},300)}).on("draw.dt",function(t,e,a,i){p(_dataTable)}),v(_dataTable,'input[type="search"]'),document.querySelector("#refresh").addEventListener("click",()=>r(!1)),document.querySelector("#filterReset").addEventListener("click",V),document.querySelector("#formFilter").addEventListener("submit",t=>{t.preventDefault(),r(),$("#modalFormFilter").modal("hide")})}function k(){_formValidation=$(S).validate({rules:{code:{required:!0,regex:T},name:{required:!0},category:{required:!0}},submitHandler:D}),m=$(y).validate({rules:{file:{required:!0,accept:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",extension:"xlsx",filesize:2048}},submitHandler:q})}function E(){$("#modalFormInput").on("hidden.bs.modal",_),g("#modalFormInput"),g("#modalFormImport"),document.getElementById("export").addEventListener("click",N)}function L(){_permissions.edit&&document.querySelector("#edit").addEventListener("click",()=>{typeof _dataTable.row({selected:!0}).data()>"u"||I(_dataTable.row({selected:!0}).data().id.trim())}),_permissions.delete&&document.querySelector("#delete").addEventListener("click",C)}function F(){u("#code"),u("#name"),u("#description")}function D(){l.Confirm("Are you sure?").then(t=>{o(!0,"#save"),f=`${_baseURL}/configs/inventories/sub-categories`,_action==="edit"&&(f+=`/${_id}`);const e=_action==="create"?"POST":"PUT",a=$("#is_active").is(":checked")?"":"&is_active=false";_data2Send=$("#formInput").serialize()+a,c(f,e,_data2Send).then(i=>{[201,200].includes(i.status)?(_action="create",Toast.fire({icon:"success",title:i.statusText,text:i.data.message}),_(),r(!1),$("#modalFormInput").modal("hide")):(l.HtmlNotification(d(i.data),`${i.status} - ${i.statusText}`),h(i.data.errors)),o(!1,"#save")}).catch(i=>{l.Notification(i.toString()),o(!1,"#save")})}).catch(t=>{t&&console.log(t)})}function I(t=null){_id=t,s("#list_datatable"),c(`${_baseURL}/configs/inventories/sub-categories/${_id}`,"GET",null).then(e=>{if([200].includes(e.status)){_(),_action="edit";const a=e.data.data;$("#code").val(a.code),$("#name").val(a.name),$("#description").val(a.description),$(`#category option[value="${a.asset_category_id}"]`).prop("selected",!0).change(),$("#is_active").prop("checked",b(a.is_active)),$("#modalFormInput").modal("show")}else l.HtmlNotification(d(e.data),`${e.status} - ${e.statusText}`);s("#list_datatable",!1)}).catch(e=>{l.Notification(e.toString()),s("#list_datatable",!1)})}function C(){if(_dataTableSelectedValues.length<=0){l.HtmlNotification("Select 1 atau more data.");return}l.Confirm(`Are you sure want to delete ${_dataTableSelectedValues.length} data?`,null,"warning").then(t=>{o(!0,"#delete"),s("#list_datatable"),_data2Send=new URLSearchParams({id:JSON.stringify(_dataTableSelectedValues)}),c(`${_baseURL}/configs/inventories/sub-categories`,"DELETE",_data2Send).then(e=>{[200].includes(e.status)?(Toast.fire({icon:"success",title:e.statusText,text:e.data.message}),x(),r(!1)):l.HtmlNotification(d(e.data),`${e.status} - ${e.statusText}`),o(!1,"#delete"),s("#list_datatable",!1)}).catch(e=>{l.Notification(e.toString()),o(!1,"#delete"),s("#list_datatable",!1)})}).catch(t=>{t&&console.log(t)})}async function N(){if(!await l.Confirm("Are you sure?").catch(a=>{a&&console.log(a)}))return;n(!0,"Please wait","Processing data...");const e=await c(`${_baseURL}/configs/inventories/sub-categories/exports`,"POST",{is_active:$("#filter_is_active").val()},"application/json");if(![200].includes(e.status)){l.HtmlNotification(d(e.data),`${e.status} - ${e.statusText}`);return}downloadFile(e.data.url),n(!1)}function r(t=!0){_dataTableResetFilter=!1,_dataTable.ajax.reload(null,t)}function _(){_action="create",_data2Send=null,_formValidation.resetForm(),$("#formInput")[0].reset(),$('#category option[value=""]').prop("selected",!0).change(),$("#is_active").prop("checked",!0)}function V(){$('#filter_is_active option[value=""]').prop("selected",!0).change(),$('#filter_category option[value=""]').prop("selected",!0).change(),$("#formFilter")[0].reset()}async function q(){if(!await l.Confirm("Are you sure?").catch(a=>{a&&console.log(a)}))return;$("#upload_info").val(null),o(!0,"#upload"),n(!0),_data2Send=new FormData($("#formImport")[0]);const e=await c(`${_baseURL}/configs/inventories/sub-categories/imports`,"POST",_data2Send,null);if(![201].includes(e.status)){o(!1,"#upload"),n(!1),l.HtmlNotification(d(e.data),`${e.status} - ${e.statusText}`),h(e.data.errors,m),$("#upload_info").val(e.data.info);return}o(!1,"#upload"),n(!1),Toast.fire({icon:"success",title:e.statusText,text:e.data.message}),$("#upload_info").val(e.data.info),R(),r(!1),$("#modalFormInput").modal("hide")}function R(){_data2Send=null,m.resetForm(),$("#file").next().html("Choose file"),$("#file").val("")}document.addEventListener("DOMContentLoaded",function(){w(),k(),E(),F(),L()});