import{f as d}from"./application-BtXPZOJh.js";import{i as b,a as g,c,x as u,M as s,l as r,f,r as m,w as h,s as n,g as p}from"./general-DAK3ebw_.js";let i=null;const v=document.querySelector("#formImport");function y(){_dataTable=$("#list_datatable").DataTable({lengthMenu:[[10,25,50,100,-1],[10,25,50,100,"All"]],pageLength:50,numbers_length:4,searchDelay:500,processing:!0,serverSide:!0,scrollX:!0,stateSave:_dataTableUseState,stateDuration:_dataTableStateDuration,scrollY:_dataTableScrollY,order:[[0,"asc"]],select:{items:"row",style:"single",className:"bg-warning"},headerCallback:function(e,a,t,l,E){e.getElementsByTagName("th")[0].innerHTML=`
            <div class="form-check">
               <input class="form-check-input datatable-group-checkable" type="checkbox" value="" id="groupCheckable" />
					<label class="form-check-label"></label>
            </div>`},createdRow:function(e,a,t){_dataTableSelectedValues.indexOf(a[_dataTableSelectColumn])>-1&&$(e).addClass("bg-light")},ajax:{url:`${_baseURL}/dt/inventories/other-devices`,type:"GET",data:function(e){e.category=$("#filter_category").val(),e.category_sub=$("#filter_category_sub").val(),e.brand=$("#filter_brand").val(),e.model=$("#filter_model").val(),e.status=$("#filter_status").val(),e.is_standalone=$("#filter_is_standalone").val()}},columns:[{data:"id",width:"30px",orderable:!1,searchable:!1,render:function(e,a,t,l){return`<div class="form-check">
                               <input class="form-check-input datatable-checkable" type="checkbox" value="${e}" ${_dataTableSelectedValues.indexOf(e)>-1?"checked":""} data-index="${l.row}" />
                                        <label class="form-check-label"></label>
                            </div>`}},{data:"asset_alias_id",render:function(e,a,t){return`<a href="${_baseURL}/inventories/other-devices/${t.id}">${e}</a>`}},{data:"asset_category_name",searchable:!1,render:function(e,a,t,l){return`<span class="label" style="background-color:${t.asset_category_tag_color}">${e}</span>`}},{data:"asset_category_sub_name",searchable:!1},{data:"other_device_name",searchable:!1},{data:"smart_device_name",searchable:!1},{data:"site_code",searchable:!1},{data:"building_code",searchable:!1},{data:"location_name",searchable:!1},{data:"status"},{data:"asset_brand_name",searchable:!1},{data:"asset_model_name",searchable:!1},{data:"serial_number"}]}).on("xhr.dt",function(e,a,t,l){setTimeout(()=>{_dataTable.columns.adjust()},300)}).on("draw.dt",function(e,a,t,l){b(_dataTable)}),g(_dataTable,'input[type="search"]'),document.querySelector("#refresh").addEventListener("click",()=>o(!1)),document.querySelector("#filterReset").addEventListener("click",D),document.querySelector("#formFilter").addEventListener("submit",e=>{e.preventDefault(),o(),$("#modalFormFilter").modal("hide")})}function T(){i=$(v).validate({rules:{file:{required:!0,accept:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",extension:"xlsx",filesize:2048}},submitHandler:F})}function x(){$("#modalFormImport").on("hidden.bs.modal",()=>{_(),$("#formImport")[0].reset()}),c("#modalFormImport"),c("#modalFormFilter"),u("#filter_category","Select",`${_baseURL}/s2/configs/inventories/categories`,["id","name"],0),u("#filter_brand","Select",`${_baseURL}/s2/configs/inventories/brands`,["id","name"],0),$("#filter_category").on("change",function(){$(this).val()&&($("#filter_category_sub").val(null).empty().trigger("change"),d("#filter_category_sub",`${_baseURL}/s2/configs/inventories/sub-categories/${$(this).val()}`))}),$("#filter_brand").on("change",function(){$(this).val()&&($("#filter_model").val(null).empty().trigger("change"),d("#filter_model",`${_baseURL}/s2/configs/inventories/models/${$(this).val()}`))}),document.getElementById("export").addEventListener("click",L)}function w(){_permissions.edit&&document.querySelector("#edit").addEventListener("click",()=>{typeof _dataTable.row({selected:!0}).data()>"u"||S(_dataTable.row({selected:!0}).data().id.trim())}),_permissions.read&&document.querySelector("#view").addEventListener("click",()=>{typeof _dataTable.row({selected:!0}).data()>"u"||k(_dataTable.row({selected:!0}).data().id.trim())})}function S(e=null){window.location.href=`${_baseURL}/inventories/other-devices/${e}/edit`}function k(e=null){window.location.href=`${_baseURL}/inventories/other-devices/${e}`}async function L(){if(!await s.Confirm("Are you sure?").catch(t=>{t&&console.log(t)}))return;r(!0,"Please wait","Processing data...");const a=await f(`${_baseURL}/inventories/other-devices/exports`,"POST",{category:$("#filter_category").val(),category_sub:$("#filter_category_sub").val(),brand:$("#filter_brand").val(),model:$("#filter_model").val(),status:$("#filter_status").val(),is_standalone:$("#filter_is_standalone").val()},"application/json");if(![200].includes(a.status)){s.HtmlNotification(m(a.data),`${a.status} - ${a.statusText}`);return}h(a.data.url),r(!1)}function o(e=!0){_dataTableResetFilter=!1,_dataTable.ajax.reload(null,e)}function D(){$("#filter_category").val(null).empty().trigger("change"),$("#filter_category_sub").val(null).empty().trigger("change"),$("#filter_brand").val(null).empty().trigger("change"),$("#filter_model").val(null).empty().trigger("change"),$('#filter_status option[value=""]').prop("selected",!0).change(),$('#filter_is_standalone option[value=""]').prop("selected",!0).change(),$("#formFilter")[0].reset()}async function F(){if(!await s.Confirm("Are you sure?").catch(t=>{t&&console.log(t)}))return;$("#upload_info").val(null),n(!0,"#upload"),r(!0),_data2Send=new FormData($("#formImport")[0]);const a=await f(`${_baseURL}/inventories/other-devices/imports`,"POST",_data2Send,null);if(![201].includes(a.status)){n(!1,"#upload"),r(!1),s.HtmlNotification(m(a.data),`${a.status} - ${a.statusText}`),p(a.data.errors,i),$("#upload_info").val(a.data.logs?a.data.logs:a.data.message);return}n(!1,"#upload"),r(!1),Toast.fire({icon:"success",title:a.statusText,text:a.data.message}),$("#upload_info").val(a.data.logs),_(),o(!1),$("#modalFormInput").modal("hide")}function _(){_data2Send=null,i.resetForm(),$("#file").next().html("Choose file"),$("#file").val("")}document.addEventListener("DOMContentLoaded",function(){y(),T(),x(),w()});