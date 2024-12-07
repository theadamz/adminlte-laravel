import{m as d,a as n,c as o,k as c,n as l}from"./general-DAK3ebw_.js";const r=moment().subtract(365,"days"),v=e=>`<div class="container rounded shadow-sm py-2 px-5">
                <div class="row">
                    <div class="col-11">
                        <div class="row mb-5">
                            <div class="col-4">
                                <strong>Ticket Creator</strong>
                            </div>
                            <div class="col-4">
                                <strong>Ticket Behalf Of</strong>
                            </div>
                            <div class="col-4">
                                <strong>Priority</strong>
                            </div>
                            <div class="col-4">
                                ${e.user_ticket_creator_name}
                            </div>
                            <div class="col-4">
                                ${e.user_behalf_of_name??"-"}
                            </div>
                            <div class="col-4">
                                ${e.ticket_priority}
                            </div>
                        </div>
                        <div class="row mb-5">
                            <div class="col-4">
                                <strong>Ticket Purpose</strong>
                            </div>
                            <div class="col-4">
                                <strong>Ticket Category</strong>
                            </div>
                            <div class="col-4">
                                <strong>Department</strong>
                            </div>
                            <div class="col-4">
                                ${e.ticket_purpose_name}
                            </div>
                            <div class="col-4">
                                ${e.ticket_category_name}
                            </div>
                            <div class="col-4">
                                ${e.department_name}
                            </div>
                        </div>
                        <div class="row mb-5">
                            <div class="col-4">
                                <strong>SBU</strong>
                            </div>
                            <div class="col-4">
                                <strong>SBU Unit</strong>
                            </div>
                            <div class="col-4">
                                <strong>Building</strong>
                            </div>
                            <div class="col-4">
                                ${e.entity_name}
                            </div>
                            <div class="col-4">
                                ${e.site_name}
                            </div>
                            <div class="col-4">
                                ${e.building_name}
                            </div>
                        </div>
                    </div>
                    <div class="col-1">
                        <div class="d-flex flex-column">
                            <a href="${_baseURL}/clients/requests/${e.id}/view" class="btn btn-outline-primary mr-2 mb-3" id="view" name="view"><i class="fas fa-eye d-inline"></i><span class="ml-2 d-none d-sm-inline font-weight-bold">View</span></a>
                            ${e.is_editable?`<a href="${_baseURL}/clients/requests/${e.id}/edit" class="btn btn-outline-warning mr-2" id="view" name="view"><i class="fas fa-edit d-inline"></i><span class="ml-2 d-none d-sm-inline font-weight-bold">Edit</span></a>`:""}
                        </div>
                    </div>
                </div>
            </div>`;function f(){_dataTable=$("#list_datatable").DataTable({lengthMenu:[[10,25,50,100,-1],[10,25,50,100,"All"]],pageLength:50,numbers_length:4,searchDelay:500,processing:!0,serverSide:!0,scrollX:!0,scrollY:!0,stateSave:_dataTableUseState,stateDuration:_dataTableStateDuration,scrollY:_dataTableScrollY,order:[[1,"asc"]],ajax:{url:`${_baseURL}/dt/clients/requests`,type:"GET",data:function(e){e.category=$("#filter_category").val(),e.department=$("#filter_department").val(),e.status=$("#filter_status").val(),e.start_date=$("#filter_date").data("daterangepicker").startDate.format("YYYY-MM-DD"),e.end_date=$("#filter_date").data("daterangepicker").endDate.format("YYYY-MM-DD")}},columns:[{data:"id",width:"30px",orderable:!1,searchable:!1,className:"dt-center details-control",render:function(e,t,a,s){return`<i class="fa fa-chevron-right" id="detail_${s.row}"></i>`}},{data:"ticket_no",width:"150px"},{data:"ticket_date",width:"80px",searchable:!1,render:function(e,t,a,s){return d(e)}},{data:"subject"},{data:"asset_name",width:"120px"},{data:"assigned_to_name"},{data:"status",width:"80px",className:"dt-center",searchable:!1}]}).on("xhr.dt",function(e,t,a,s){setTimeout(()=>{_dataTable.columns.adjust()},300)}),_dataTable.on("click","td.details-control",function(e){const t=$(this).closest("tr"),a=_dataTable.row(t);e.target.id&&(a.child.isShown()?($(`#${e.target.id}`).removeClass("fa fa-chevron-down").addClass("fa fa-chevron-right"),a.child.hide(),t.removeClass("shown")):(a.child(v(a.data())).show(),$(`#${e.target.id}`).removeClass("fa fa-chevron-right").addClass("fa fa-chevron-down"),t.addClass("shown")))}),n(_dataTable,'input[type="search"]'),document.querySelector("#refresh").addEventListener("click",()=>i(!1)),document.querySelector("#filterReset").addEventListener("click",g),document.querySelector("#formFilter").addEventListener("submit",e=>{e.preventDefault(),i(),$("#modalFormFilter").modal("hide")})}function u(){o("#modalFormFilter"),c("#filter_date"),l("#filter_date",r)}function i(e=!0){_dataTableResetFilter=!1,_dataTable.ajax.reload(null,e)}function g(){$("#filter_category").val(null).empty().trigger("change"),$("#filter_department").val(null).empty().trigger("change"),$("#filter_status").val(null).empty().trigger("change"),$("#formFilter")[0].reset(),setTimeout(()=>{l("#filter_date",r)},500)}document.addEventListener("DOMContentLoaded",function(){u(),f()});
