import {
    axiosCustom,
    loadingProcess,
    MsgBox,
    refactorErrorMessages
} from "./general.js";
import {
    lovCommonInitialize
} from "./pages/lov/common.js";

export async function clearCache() {
    const confirmation = await MsgBox.Confirm('clear cache?').catch(err => {
        if (err) console.log(err)
    });
    if (!confirmation) return;
    loadingProcess(true, 'Please wait', 'Clearing Cache...');

    // get data
    const response = await axiosCustom(`${_baseURL}/cache-clear`, 'GET', null);

    // if status not OK
    if (![200].includes(response.status)) {
        MsgBox.HtmlNotification(refactorErrorMessages(response.data), `${response.status} - ${response.statusText}`);
        return;
    }

    Toast.fire({
        icon: 'success',
        title: response.statusText,
        text: response.data.message
    });
}

export async function getOptionsAjax(url) {
    // get data
    const response = await axiosCustom(url, 'GET', null);

    // if status not OK
    if (![200].includes(response.status)) {
        return null;
    }

    return response.data;
}

export async function fillOptionsFromAjax(elementId, url, selectedId = null, selectedIndex = null, valueArr = ['id', 'name'], message = 'Retriving data...') {
    // disable element
    $(elementId).prop('disabled', true);

    // check if element has class form-select2
    if ($(elementId).hasClass('form-select2')) {
        $(elementId).next().after(`<small class="text-muted text-status">${message}</small>`);
    } else {
        // append element for indicator
        $(elementId).after(`<small class="text-muted text-status">${message}</small>`);
    }

    // clear options
    $(elementId).val(null).empty().trigger('change');

    // get options
    const response = await getOptionsAjax(url);

    // if null
    if (!response) {
        $(elementId).val(null).empty().trigger('change');
        $(elementId).prop('disabled', false);
        $(elementId).siblings('.text-status').remove();
        return;
    }

    $(elementId).append(new Option("", "", true, true));
    for (const opt of response.data) {
        $(elementId).append(new Option(opt[valueArr[1]], opt[valueArr[0]], false, selectedId == opt[valueArr[0]]));
    }
    $(elementId).prop('disabled', false);
    $(elementId).siblings('.text-status').remove();
    $(elementId).trigger('change');

    if (selectedIndex) {
        $(elementId).prop('selectedIndex', selectedIndex).trigger('change');
    }
}

export const select2TemplateOptions = {
    defaultResult: (item) => {
        if (item.id && item.text) {
            return item.text;
        }

        if (!item.id) {
            return item.text;
        }

        return `${item.name}`;
    },
    defaultSelection: (item) => {
        if (item.id && item.text) {
            return item.text;
        }

        if (!item.id) {
            return item.text;
        }

        return `${item.name}`;
    },
    userResult: (item) => {
        // still loading
        if (!item.id) {
            return item.text;
        }

        return `<div class="d-flex flex-column">
                    <span class="font-weight-bold">${item.name}</span>
                    <span class="font-weight-light">${item.email}</span>
                </div>`
    },
    userSelection: (item) => {
        if (item.id && item.text) {
            return item.text;
        }

        if (!item.id) {
            return item.text;
        }

        return `${item.name}`;
    },
    userSelectionNameEmail: (item) => {
        if (item.id && item.text) {
            return item.text;
        }

        if (!item.id) {
            return item.text;
        }

        return `<div class="d-flex">
                    <span class="font-weight-bold mr-1">${item.name}</span>
                    <span class="font-weight-light">(${item.email})</span>
                </div>`;
    },
}

export const lovCommon = {
    data: {},
    init: ({
        url,
        buttonOpenLOVElement = null,
        buttonClearLOVElement = null,
        hiddenElement,
        captionElement,
        descriptionElement = null,
        dependencyElement = null,
        hiddenColumnName = 'id',
        captionColumnName = 'name',
        descriptionColumnName = 'description',
        modalSize = 'modal-lg'
    }) => {
        buttonOpenLOVElement = buttonOpenLOVElement ? buttonOpenLOVElement : `${hiddenElement}LOV`
        document.querySelector(`${buttonOpenLOVElement}`).addEventListener('click', function () {
            if (dependencyElement) {
                if (!$(`${dependencyElement}`).val()) return;
            }

            lovCommon.load({
                url: url,
                hiddenElement: hiddenElement,
                captionElement: captionElement,
                descriptionElement: descriptionElement,
                hiddenColumnName: hiddenColumnName,
                captionColumnName: captionColumnName,
                descriptionColumnName: descriptionColumnName,
                modalSize: modalSize
            });
        });

        if (buttonClearLOVElement) {
            document.querySelector(`${buttonClearLOVElement}`).addEventListener('click', function () {
                lovCommon.clearElements();
            });
        }
    },
    load: ({
        url,
        hiddenElement,
        captionElement,
        descriptionElement = null,
        hiddenColumnName = 'id',
        captionColumnName = 'name',
        descriptionColumnName = 'description',
        modalSize = 'modal-lg'
    }) => {
        loadingProcess();
        $('#_dynamic_content').load(`${url}`, () => {
            loadingProcess(false);
            $('#_modal_lov').modal('show');
            $(".modal-dialog").addClass(`${modalSize}`);
            lovCommonInitialize();

            $('#_modal_lov').on('hide.bs.modal', function () {
                if ($resultFromLOV.result) {
                    if (lovCommon.data[hiddenColumnName] == $resultFromLOV.data[hiddenColumnName]) return;
                    lovCommon.data[hiddenColumnName] = $resultFromLOV.data[hiddenColumnName];

                    $(`${hiddenElement}`).val($resultFromLOV.data[hiddenColumnName]);
                    $(`${captionElement}`).val($resultFromLOV.data[captionColumnName]);
                    if (descriptionElement) {
                        $(`${descriptionElement}`).text($resultFromLOV.data[descriptionColumnName]);
                    }
                }
            });
        });
    },
    clearElements: ({
        hiddenElement,
        captionElement,
        descriptionElement
    }) => {
        $(`${hiddenElement}`).val(null)
        $(`${captionElement}`).val(null);
        if (descriptionElement) {
            $(`${descriptionElement}`).text(null);
        }
    }
}
