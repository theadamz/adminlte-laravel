import{b as c,i as v,a as S,v as T,c as y,e as n,M as l,s as r,q as k,f,r as _,g as w,h as d,_ as x}from"./general-DAK3ebw_.js";let m=null;const E=document.querySelector("#formInput");function q(){_dataTable=$("#list_datatable").DataTable({lengthMenu:[[10,25,50,100,-1],[10,25,50,100,"All"]],pageLength:50,numbers_length:4,searchDelay:500,processing:!0,serverSide:!0,scrollX:!0,stateSave:_dataTableUseState,stateDuration:_dataTableStateDuration,scrollY:_dataTableScrollY,order:[[0,"asc"]],select:{items:"row",style:"single",className:"bg-warning"},headerCallback:function(e,t,a,i,o){e.getElementsByTagName("th")[0].innerHTML=`
            <div class="form-check">
               <input class="form-check-input datatable-group-checkable" type="checkbox" value="" id="groupCheckable" />
					<label class="form-check-label"></label>
            </div>`},createdRow:function(e,t,a){_dataTableSelectedValues.indexOf(t[_dataTableSelectColumn])>-1&&$(e).addClass("bg-light")},ajax:{url:`${_baseURL}/dt/configs/setups/sites`,type:"GET",data:function(e){e.is_active=$("#filter_is_active").val(),e.is_24hours=$("#filter_is_24hours").val(),e.timezone=$("#filter_timezone").val()}},columns:[{data:"id",width:"30px",orderable:!1,searchable:!1,render:function(e,t,a,i){return`<div class="form-check">
                               <input class="form-check-input datatable-checkable" type="checkbox" value="${e}" ${_dataTableSelectedValues.indexOf(e)>-1?"checked":""} data-index="${i.row}" />
                                        <label class="form-check-label"></label>
                            </div>`}},{data:"code"},{data:"name"},{data:"address"},{data:"city"},{data:"is_active",className:"dt-center",searchable:!1,render:function(e,t,a,i){return c(e)?'<span class="badge font-weight-normal badge-success">Yes</span>':'<span class="badge font-weight-normal badge-warning">No</span>'}},{data:"is_24hours",className:"dt-center",searchable:!1,render:function(e,t,a,i){return c(e)?'<span class="badge font-weight-normal badge-success">Yes</span>':'<span class="badge font-weight-normal badge-warning">No</span>'}},{data:"timezone"}]}).on("xhr.dt",function(e,t,a,i){setTimeout(()=>{_dataTable.columns.adjust()},300)}).on("draw.dt",function(e,t,a,i){v(_dataTable)}),S(_dataTable,'input[type="search"]'),document.querySelector("#refresh").addEventListener("click",()=>u(!1)),document.querySelector("#filterReset").addEventListener("click",M),document.querySelector("#formFilter").addEventListener("submit",e=>{e.preventDefault(),u(),$("#modalFormFilter").modal("hide")})}function L(){_formValidation=$(E).validate({rules:{code:{required:!0,regex:T},name:{required:!0},address:{required:!0},city:{required:!0},entity:{required:!0},timezone:{required:!0},"start_time[]":{required:!0,timeValid:!0},"end_time[]":{required:!0,timeValid:!0}},submitHandler:V})}function D(){$("#modalFormInput").on("hidden.bs.modal",h),y("#modalFormInput"),Inputmask({mask:"99:99"}).mask(".start-time"),Inputmask({mask:"99:99"}).mask(".end-time")}function F(){_permissions.edit&&document.querySelector("#edit").addEventListener("click",()=>{typeof _dataTable.row({selected:!0}).data()>"u"||C(_dataTable.row({selected:!0}).data().id.trim())}),_permissions.delete&&document.querySelector("#delete").addEventListener("click",I)}function N(){n("#code"),n("#name"),n("#address"),n("#city"),n("#postal_code"),n("#phone_no"),n("#fax_no"),n("#web_url")}function V(){l.Confirm("Are you sure?").then(e=>{r(!0,"#save"),m=`${_baseURL}/configs/setups/sites`,_action==="edit"&&(m+=`/${_id}`);const t=_action==="create"?"POST":"PUT";_data2Send=k($("#formInput").serialize(),!1),delete _data2Send["start_time[]"],delete _data2Send["end_time[]"],_data2Send.is_active=$("#is_active").is(":checked"),_data2Send.is_24hours=$("#is_24hours").is(":checked");const a=document.querySelectorAll(".start-time"),i=[];a.forEach(s=>{i.push($(s).val())}),_data2Send.start_times=i;const o=document.querySelectorAll(".end-time"),p=[];o.forEach(s=>{p.push($(s).val())}),_data2Send.end_times=p;const g=document.querySelectorAll(".holiday"),b=[];g.forEach(s=>{b.push($(s).is(":checked"))}),_data2Send.holidays=b,f(m,t,_data2Send,"application/json").then(s=>{[201,200].includes(s.status)?(_action="create",Toast.fire({icon:"success",title:s.statusText,text:s.data.message}),h(),u(!1),$("#modalFormInput").modal("hide")):(l.HtmlNotification(_(s.data),`${s.status} - ${s.statusText}`),w(s.data.errors)),r(!1,"#save")}).catch(s=>{l.Notification(s.toString()),r(!1,"#save")})}).catch(e=>{e&&console.log(e)})}function C(e=null){_id=e,d("#list_datatable"),f(`${_baseURL}/configs/setups/sites/${_id}`,"GET",null).then(t=>{if([200].includes(t.status)){h(),_action="edit";const a=t.data.data;$("#code").val(a.code),$("#name").val(a.name),$("#address").val(a.address),$("#city").val(a.city),$("#postal_code").val(a.postal_code),$("#phone_no").val(a.phone_no),$("#fax_no").val(a.fax_no),$("#web_url").val(a.web_url),$('#entity option[value="'+a.entity_id+'"]').prop("selected",!0).change(),$(`#timezone option[value="${a.timezone}"]`).prop("selected",!0).change(),$("#is_active").prop("checked",c(a.is_active)),$("#is_24hours").prop("checked",c(a.is_24hours)),a.site_working_schemes.forEach((i,o)=>{$(`#start_time_${o}`).val(i.from_time),$(`#end_time_${o}`).val(i.until_time),$(`#holiday_${o}`).prop("checked",c(i.is_holiday))}),$("#modalFormInput").modal("show")}else l.HtmlNotification(_(t.data),`${t.status} - ${t.statusText}`);d("#list_datatable",!1)}).catch(t=>{l.Notification(t.toString()),d("#list_datatable",!1)})}function I(){if(_dataTableSelectedValues.length<=0){l.HtmlNotification("Select 1 atau more data.");return}l.Confirm(`Are you sure want to delete ${_dataTableSelectedValues.length} data?`,null,"warning").then(e=>{r(!0,"#delete"),d("#list_datatable"),_data2Send=new URLSearchParams({id:JSON.stringify(_dataTableSelectedValues)}),f(`${_baseURL}/configs/setups/sites`,"DELETE",_data2Send).then(t=>{[200].includes(t.status)?(Toast.fire({icon:"success",title:t.statusText,text:t.data.message}),x(),u(!1)):l.HtmlNotification(_(t.data),`${t.status} - ${t.statusText}`),r(!1,"#delete"),d("#list_datatable",!1)}).catch(t=>{l.Notification(t.toString()),r(!1,"#delete"),d("#list_datatable",!1)})}).catch(e=>{e&&console.log(e)})}function u(e=!0){_dataTableResetFilter=!1,_dataTable.ajax.reload(null,e)}function h(){_action="create",_data2Send=null,_formValidation.resetForm(),$("#formInput")[0].reset(),$('#entity option[value=""]').prop("selected",!0).change(),$('#timezone option[value=""]').prop("selected",!0).change(),$("#is_active").prop("checked",!0),$("#is_24hours").prop("checked",!1)}function M(){$('#filter_is_active option[value=""]').prop("selected",!0).change(),$('#filter_is_24hours option[value=""]').prop("selected",!0).change(),$('#filter_timezone option[value=""]').prop("selected",!0).change(),$("#formFilter")[0].reset()}document.addEventListener("DOMContentLoaded",function(){q(),L(),D(),N(),F()});
