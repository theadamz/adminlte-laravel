import{i as g,a as v,v as T,c as p,e as c,M as n,s,q as S,f,r as m,g as x,h as o,_ as y}from"./general-DAK3ebw_.js";let u=null;const k=document.querySelector("#formInput");let l=[],d=null,_=null;function w(){_dataTable=$("#list_datatable").DataTable({lengthMenu:[[10,25,50,100,-1],[10,25,50,100,"All"]],pageLength:50,numbers_length:4,searchDelay:500,processing:!0,serverSide:!0,scrollX:!0,stateSave:_dataTableUseState,stateDuration:_dataTableStateDuration,scrollY:_dataTableScrollY,order:[[0,"asc"]],select:{items:"row",style:"single",className:"bg-warning"},headerCallback:function(e,t,a,i,U){e.getElementsByTagName("th")[0].innerHTML=`
            <div class="form-check">
               <input class="form-check-input datatable-group-checkable" type="checkbox" value="" id="groupCheckable" />
					<label class="form-check-label"></label>
            </div>`},createdRow:function(e,t,a){_dataTableSelectedValues.indexOf(t[_dataTableSelectColumn])>-1&&$(e).addClass("bg-light")},ajax:{url:`${_baseURL}/dt/configs/inventories/certificates`,type:"GET",data:function(e){}},columns:[{data:"id",width:"30px",orderable:!1,searchable:!1,render:function(e,t,a,i){return`<div class="form-check">
                               <input class="form-check-input datatable-checkable" type="checkbox" value="${e}" ${_dataTableSelectedValues.indexOf(e)>-1?"checked":""} data-index="${i.row}" />
                                        <label class="form-check-label"></label>
                            </div>`}},{data:"code"},{data:"name"},{data:"description"},{orderable:!1,searchable:!1,className:"text-center",data:"asset_certificate_details_count"}]}).on("xhr.dt",function(e,t,a,i){setTimeout(()=>{_dataTable.columns.adjust()},300)}).on("draw.dt",function(e,t,a,i){g(_dataTable)}),v(_dataTable,'input[type="search"]'),document.querySelector("#refresh").addEventListener("click",()=>b(!1))}function D(){_formValidation=$(k).validate({rules:{code:{required:!0,regex:T},name:{required:!0}},submitHandler:I}),_=$(document.querySelector("#formInputDetail")).validate({rules:{detail_name:{required:!0},detail_value:{required:!0}},submitHandler:V})}function E(){$("#modalFormInput").on("hidden.bs.modal",h),p("#modalFormInput"),r()}function L(){_permissions.edit&&document.querySelector("#edit").addEventListener("click",()=>{typeof _dataTable.row({selected:!0}).data()>"u"||N(_dataTable.row({selected:!0}).data().id.trim())}),_permissions.delete&&document.querySelector("#delete").addEventListener("click",F)}function C(){c("#code"),c("#name"),c("#description"),c("#detail_name"),c("#detail_value")}function I(){if(l.length<=0){n.HtmlNotification("Please add on or more details","Detail not found");return}n.Confirm("Are you sure?").then(e=>{s(!0,"#save"),u=`${_baseURL}/configs/inventories/certificates`,_action==="edit"&&(u+=`/${_id}`);const t=_action==="create"?"POST":"PUT";_data2Send=S($("#formInput").serialize(),!1),_data2Send.details=l,f(u,t,_data2Send,"application/json").then(a=>{[201,200].includes(a.status)?(_action="create",Toast.fire({icon:"success",title:a.statusText,text:a.data.message}),h(),b(!1),$("#modalFormInput").modal("hide")):(n.HtmlNotification(m(a.data),`${a.status} - ${a.statusText}`),x(a.data.errors)),s(!1,"#save")}).catch(a=>{n.Notification(a.toString()),s(!1,"#save")})}).catch(e=>{e&&console.log(e)})}function N(e=null){_id=e,o("#list_datatable"),f(`${_baseURL}/configs/inventories/certificates/${_id}`,"GET",null).then(t=>{if([200].includes(t.status)){h(),_action="edit";const a=t.data.data;$("#code").val(a.code),$("#name").val(a.name),$("#description").val(a.description),l=a.asset_certificate_details,r(),$("#modalFormInput").modal("show")}else n.HtmlNotification(m(t.data),`${t.status} - ${t.statusText}`);o("#list_datatable",!1)}).catch(t=>{n.Notification(t.toString()),o("#list_datatable",!1)})}function F(){if(_dataTableSelectedValues.length<=0){n.HtmlNotification("Select 1 atau more data.");return}n.Confirm(`Are you sure want to delete ${_dataTableSelectedValues.length} data?`,null,"warning").then(e=>{s(!0,"#delete"),o("#list_datatable"),_data2Send=new URLSearchParams({id:JSON.stringify(_dataTableSelectedValues)}),f(`${_baseURL}/configs/inventories/certificates`,"DELETE",_data2Send).then(t=>{[200].includes(t.status)?(Toast.fire({icon:"success",title:t.statusText,text:t.data.message}),y(),b(!1)):n.HtmlNotification(m(t.data),`${t.status} - ${t.statusText}`),s(!1,"#delete"),o("#list_datatable",!1)}).catch(t=>{n.Notification(t.toString()),s(!1,"#delete"),o("#list_datatable",!1)})}).catch(e=>{e&&console.log(e)})}function b(e=!0){_dataTableResetFilter=!1,_dataTable.ajax.reload(null,e)}function h(){_action="create",_data2Send=null,_formValidation.resetForm(),$("#formInput")[0].reset(),l=[],r()}function V(){const e={id:d??l.length,name:$("#detail_name").val(),value:$("#detail_value").val()};d!=null&&(l=l.filter(t=>t.id!=d)),l.push(e),r(),d=null}function r(){if($(".detail-edit").off("click"),$(".detail-delete").off("click"),l.length<=0){$("#certificateDetailTable tbody").html(`<tr>
                                                <td scope="row" colspan="3" class="text-center">
                                                    <span class="p-5">Please add detail.</span>
                                                </td>
                                                </tr>`);return}let e="";l.forEach(t=>{e+=`<tr>
        <td>${t.name}</td>
        <td>${t.value}</td>
        <td class="text-right">
            <button type="button" class="btn btn-warning detail-edit" data-id="${t.id}">
                <i class="fas fa-pencil-alt"></i>
            </button>
            <button type="button" class="btn btn-danger detail-delete" data-id="${t.id}">
                <i class="fas fa-trash"></i>
            </button>
        </td>
        </tr>`}),$("#certificateDetailTable tbody").html(e),$(".detail-edit").on("click",q),$(".detail-delete").on("click",M),_.resetForm(),$("#formInputDetail")[0].reset()}function q(){const e=$(this).data("id"),t=l.find(a=>a.id==e);t&&($("#detail_name").val(t.name),$("#detail_value").val(t.value),d=e)}async function M(){const e=$(this).data("id"),t=l.find(i=>i.id==e);!t||!await n.Confirm(`Are you sure want to delete detail (${t.name})?`).catch(i=>{i&&console.log(i)})||(l=l.filter(i=>i.id!=e),r())}document.addEventListener("DOMContentLoaded",function(){w(),D(),E(),C(),L()});
