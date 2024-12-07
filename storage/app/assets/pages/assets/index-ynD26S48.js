import{f as b}from"./application-BtXPZOJh.js";import{b as g,m as p,i as h,a as y,c as m,x as o,M as s,s as r,h as c,f as d,_ as v,r as u,l as i,w as T,g as w}from"./general-DAK3ebw_.js";let f=null;const x=document.querySelector("#formImport");function S(){_dataTable=$("#list_datatable").DataTable({lengthMenu:[[10,25,50,100,-1],[10,25,50,100,"All"]],pageLength:50,numbers_length:4,searchDelay:500,processing:!0,serverSide:!0,scrollX:!0,scrollY:!0,stateSave:_dataTableUseState,stateDuration:_dataTableStateDuration,scrollY:_dataTableScrollY,order:[[0,"asc"]],select:{items:"row",style:"single",className:"bg-warning"},headerCallback:function(e,a,t,l,I){e.getElementsByTagName("th")[0].innerHTML=`
            <div class="form-check">
               <input class="form-check-input datatable-group-checkable" type="checkbox" value="" id="groupCheckable" />
					<label class="form-check-label"></label>
            </div>`},createdRow:function(e,a,t){_dataTableSelectedValues.indexOf(a[_dataTableSelectColumn])>-1&&$(e).addClass("bg-light")},ajax:{url:`${_baseURL}/dt/inventories/os-licenses`,type:"GET",data:function(e){e.category=$("#filter_category").val(),e.category_sub=$("#filter_category_sub").val(),e.manufacturer=$("#filter_manufacturer").val(),e.certificate=$("#filter_certificate").val(),e.license_type=$("#filter_license_type").val(),e.is_reassignable=$("#filter_is_reassignable").val()}},columns:[{data:"id",width:"30px",orderable:!1,searchable:!1,render:function(e,a,t,l){return`<div class="form-check">
                               <input class="form-check-input datatable-checkable" type="checkbox" value="${e}" ${_dataTableSelectedValues.indexOf(e)>-1?"checked":""} data-index="${l.row}" />
                                        <label class="form-check-label"></label>
                            </div>`}},{data:"license_id",render:function(e,a,t){return`<a href="${_baseURL}/inventories/os-licenses/${t.id}">${e}</a>`}},{data:"asset_category_name",searchable:!1,render:function(e,a,t,l){return`<span class="label" style="background-color:${t.asset_category_tag_color}">${e}</span>`}},{data:"asset_category_sub_name",searchable:!1},{data:"asset_manufacturer_name",searchable:!1},{data:"asset_certificate_name",searchable:!1},{data:"type",searchable:!1},{data:"license_key",searchable:!1},{data:"purchase_qty",className:"dt-center",width:"30px",searchable:!1},{data:"used_qty",className:"dt-center",searchable:!1},{data:"status",className:"dt-center",orderable:!1,searchable:!1},{data:"is_reassignable",className:"dt-center",searchable:!1,render:function(e,a,t,l){return g(e)?'<span class="badge font-weight-normal badge-success">Yes</span>':'<span class="badge font-weight-normal badge-warning">No</span>'}},{data:"expire_date",className:"dt-center",searchable:!1,render:function(e,a,t,l){return t.type=="Perpetual"?"-":p(e)}},{data:"order_id"}]}).on("xhr.dt",function(e,a,t,l){setTimeout(()=>{_dataTable.columns.adjust()},300)}).on("draw.dt",function(e,a,t,l){h(_dataTable)}),y(_dataTable,'input[type="search"]'),document.querySelector("#refresh").addEventListener("click",()=>n(!1)),document.querySelector("#filterReset").addEventListener("click",U),document.querySelector("#formFilter").addEventListener("submit",e=>{e.preventDefault(),n(),$("#modalFormFilter").modal("hide")})}function L(){f=$(x).validate({rules:{file:{required:!0,accept:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",extension:"xlsx",filesize:2048}},submitHandler:C})}function k(){$("#modalFormImport").on("hidden.bs.modal",()=>{_(),$("#formImport")[0].reset()}),m("#modalFormImport"),m("#modalFormFilter"),o("#filter_category","Select",`${_baseURL}/s2/configs/inventories/categories`,["id","name"],0),o("#filter_manufacturer","Select",`${_baseURL}/s2/configs/inventories/manufacturers`,["id","name"],0),o("#filter_certificate","Select",`${_baseURL}/s2/configs/inventories/certificates`,["id","name"],0),$("#filter_category").on("change",function(){$(this).val()&&($("#filter_category_sub").val(null).empty().trigger("change"),b("#filter_category_sub",`${_baseURL}/s2/configs/inventories/sub-categories/${$(this).val()}`))}),document.getElementById("export").addEventListener("click",N)}function E(){_permissions.edit&&document.querySelector("#edit").addEventListener("click",()=>{typeof _dataTable.row({selected:!0}).data()>"u"||D(_dataTable.row({selected:!0}).data().id.trim())}),_permissions.delete&&document.querySelector("#delete").addEventListener("click",F),_permissions.read&&document.querySelector("#view").addEventListener("click",()=>{typeof _dataTable.row({selected:!0}).data()>"u"||R(_dataTable.row({selected:!0}).data().id.trim())})}function D(e=null){window.location.href=`${_baseURL}/inventories/os-licenses/${e}/edit`}function F(){if(_dataTableSelectedValues.length<=0){s.HtmlNotification("Select 1 atau more data.");return}s.Confirm(`Are you sure want to delete ${_dataTableSelectedValues.length} data?`,null,"warning").then(e=>{r(!0,"#delete"),c("#list_datatable"),_data2Send=new URLSearchParams({id:JSON.stringify(_dataTableSelectedValues)}),d(`${_baseURL}/inventories/os-licenses`,"DELETE",_data2Send).then(a=>{[200].includes(a.status)?(Toast.fire({icon:"success",title:a.statusText,text:a.data.message}),v(),n(!1)):s.HtmlNotification(u(a.data),`${a.status} - ${a.statusText}`),r(!1,"#delete"),c("#list_datatable",!1)}).catch(a=>{s.Notification(a.toString()),r(!1,"#delete"),c("#list_datatable",!1)})}).catch(e=>{e&&console.log(e)})}function R(e=null){window.location.href=`${_baseURL}/inventories/os-licenses/${e}`}async function N(){if(!await s.Confirm("Are you sure?").catch(t=>{t&&console.log(t)}))return;i(!0,"Please wait","Processing data...");const a=await d(`${_baseURL}/inventories/os-licenses/exports`,"POST",{category:$("#filter_category").val(),category_sub:$("#filter_category_sub").val(),manufacturer:$("#filter_manufacturer").val(),certificate:$("#filter_certificate").val(),license_type:$("#filter_license_type").val(),is_reassignable:$("#filter_is_reassignable").val()},"application/json");if(![200].includes(a.status)){s.HtmlNotification(u(a.data),`${a.status} - ${a.statusText}`);return}T(a.data.url),i(!1)}function n(e=!0){_dataTableResetFilter=!1,_dataTable.ajax.reload(null,e)}function U(){$("#filter_category").val(null).empty().trigger("change"),$("#filter_category_sub").val(null).empty().trigger("change"),$("#filter_manufacturer").val(null).empty().trigger("change"),$("#filter_certificate").val(null).empty().trigger("change"),$('#filter_license_type option[value=""]').prop("selected",!0).change(),$('#filter_is_reassignable option[value=""]').prop("selected",!0).change(),$("#formFilter")[0].reset()}async function C(){if(!await s.Confirm("Are you sure?").catch(t=>{t&&console.log(t)}))return;$("#upload_info").val(null),r(!0,"#upload"),i(!0),_data2Send=new FormData($("#formImport")[0]);const a=await d(`${_baseURL}/inventories/os-licenses/imports`,"POST",_data2Send,null);if(![201].includes(a.status)){r(!1,"#upload"),i(!1),s.HtmlNotification(u(a.data),`${a.status} - ${a.statusText}`),w(a.data.errors,f),$("#upload_info").val(a.data.logs?a.data.logs:a.data.message);return}r(!1,"#upload"),i(!1),Toast.fire({icon:"success",title:a.statusText,text:a.data.message}),$("#upload_info").val(a.data.logs),_(),n(!1),$("#modalFormInput").modal("hide")}function _(){_data2Send=null,f.resetForm(),$("#file").next().html("Choose file"),$("#file").val("")}document.addEventListener("DOMContentLoaded",function(){S(),L(),k(),E()});
