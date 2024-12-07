import{i as m,a as f,c as d,M as c,s,l as r,f as b,r as _,g as h}from"./general-DAK3ebw_.js";let n=null;const p=document.querySelector("#formImport");function v(){_dataTable=$("#list_datatable").DataTable({lengthMenu:[[10,25,50,100,-1],[10,25,50,100,"All"]],pageLength:50,numbers_length:4,searchDelay:500,processing:!0,serverSide:!0,scrollX:!0,stateSave:_dataTableUseState,stateDuration:_dataTableStateDuration,scrollY:_dataTableScrollY,order:[[0,"asc"]],select:{items:"row",style:"single",className:"bg-warning"},headerCallback:function(e,a,t,l,i){e.getElementsByTagName("th")[0].innerHTML=`
          <div class="form-check">
             <input class="form-check-input datatable-group-checkable" type="checkbox" value="" id="groupCheckable" />
        <label class="form-check-label"></label>
          </div>`},createdRow:function(e,a,t){_dataTableSelectedValues.indexOf(a[_dataTableSelectColumn])>-1&&$(e).addClass("bg-light")},ajax:{url:`${_baseURL}/dt/inventories/smart-devices`,type:"GET",data:function(e){e.is_active=$("#filter_is_active").val(),e.is_ticketable=$("#filter_is_ticketable").val()}},columns:[{data:"id",width:"30px",orderable:!1,searchable:!1,render:function(e,a,t,l){return`<div class="form-check">
                             <input class="form-check-input datatable-checkable" type="checkbox" value="${e}" ${_dataTableSelectedValues.indexOf(e)>-1?"checked":""} data-index="${l.row}" />
                                      <label class="form-check-label"></label>
                          </div>`}},{data:"null",render:function(e,a,t){const l=t.asset_alias_id,i=t.id;return`<a href="${_baseURL}/inventories/smart-devices/${i}">${l}</a>`}},{data:"asset_category_name",searchable:!1},{data:"asset_category_sub_name",searchable:!1},{data:"smart_device_name",searchable:!1},{data:"asset_owner_name",searchable:!1},{data:"site_code",searchable:!1},{data:"building_code",searchable:!1},{data:"location_name",searchable:!1},{data:"status"},{data:"asset_brand_name",searchable:!1},{data:"asset_model_name",searchable:!1},{data:"serial_number"}]}).on("xhr.dt",function(e,a,t,l){setTimeout(()=>{_dataTable.columns.adjust()},300)}).on("draw.dt",function(e,a,t,l){m(_dataTable)}),f(_dataTable,'input[type="search"]'),document.querySelector("#refresh").addEventListener("click",()=>o(!1)),document.querySelector("#filterReset").addEventListener("click",x),document.querySelector("#formFilter").addEventListener("submit",e=>{e.preventDefault(),o(),$("#modalFormFilter").modal("hide")})}function g(){n=$(p).validate({rules:{file:{required:!0,accept:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",extension:"xlsx",filesize:2048}},submitHandler:k})}function T(){$("#modalFormImport").on("hidden.bs.modal",()=>{u(),$("#formImport")[0].reset()}),d("#modalFormImport"),d("#modalFormFilter")}function o(e=!0){_dataTableResetFilter=!1,_dataTable.ajax.reload(null,e)}function x(){$('#filter_is_active option[value=""]').prop("selected",!0).change(),$('#filter_is_ticketable option[value=""]').prop("selected",!0).change(),$("#formFilter")[0].reset()}async function k(){if(!await c.Confirm("Are you sure?").catch(t=>{t&&console.log(t)}))return;$("#upload_info").val(null),s(!0,"#upload"),r(!0),_data2Send=new FormData($("#formImport")[0]);const a=await b(`${_baseURL}/inventories/smart-devices/imports`,"POST",_data2Send,null);if(console.log(a.data),![201].includes(a.status)){s(!1,"#upload"),r(!1),c.HtmlNotification(_(a.data),`${a.status} - ${a.statusText}`),h(a.data.errors,n),$("#upload_info").val(a.data.info);return}s(!1,"#upload"),r(!1),Toast.fire({icon:"success",title:a.statusText,text:a.data.message}),$("#upload_info").val(a.data.info),u(),o(!1),$("#modalFormImport").modal("hide")}function u(){_data2Send=null,n.resetForm(),$("#file").next().html("Choose file"),$("#file").val("")}document.addEventListener("DOMContentLoaded",function(){v(),g(),T()});
