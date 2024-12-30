<?php

namespace App\Http\Controllers\Basic;

use App\Helpers\GeneralHelper;
use App\Helpers\OpenSpoutHelper;
use App\Http\Controllers\Controller;
use App\Http\Requests\Basic\WarehouseRequest;
use App\Models\Basic\Warehouse;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Vite;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\File;
use Illuminate\View\View;
use Symfony\Component\HttpFoundation\Response;
use Yajra\DataTables\Facades\DataTables;

class WarehouseController extends Controller
{
    protected string $templateName = "template_warehouses.xlsx";

    public function index()
    {
        // js
        GeneralHelper::addAdditionalJS([
            'resources/js/pages/basic/warehouse.js'
        ]);

        // template name
        $templateName = $this->templateName;

        return view('basic.warehouse')->with(compact('templateName'));
    }

    public function datatable(Request $request): JsonResponse
    {
        $queries = Warehouse::selectRaw("id, code, name, address, telephone, fax, is_active")->withCount('warehouse_locations')
            ->when($request->filled('is_active'), function ($query) use ($request) {
                return $query->where('is_active', filter_var($request->get('is_active'), FILTER_VALIDATE_BOOLEAN));
            });

        return DataTables::eloquent($queries)->toJson();
    }

    public function store(WarehouseRequest $request): JsonResponse
    {
        // validate request
        $validated = $request->validated();

        // check for duplicate
        $exist = Warehouse::where(function (Builder $query) use ($validated) {
            $query->whereRaw('LOWER(code)=?', [str($validated['code'])->lower()]);
        })->exists();

        // if exist then
        if ($exist) {
            throw new HttpResponseException(response([
                "errors" => [
                    "code" => [
                        "code already exist."
                    ],

                ],
                "message" => Response::$statusTexts[Response::HTTP_CONFLICT],
            ], Response::HTTP_CONFLICT));
        }

        // save
        $data = new Warehouse($validated);
        $data->save();

        return response()->json(["message" => "Data successfully created."])->setStatusCode(Response::HTTP_CREATED);
    }

    public function storeImport(Request $request, OpenSpoutHelper $openSpout): JsonResponse
    {
        // Prepare input
        $input = [
            'file' => $request->file('file')
        ];

        // Validate input
        $validated = Validator::make($input, [
            'file' => ["required", File::types(['xlsx'])->max(2048)],
        ])->validated();

        try {
            // handle file upload
            $file = $validated['file'];

            // save file with hash filename
            $file->storeAs(config('setting.other.path_to_temp'), $file->hashName());

            // construct the full path for reading the file
            $filePath = storage_path('app/' . config('setting.other.path_to_temp') . '/' . $file->hashName());

            // Check if the file exists
            if (!file_exists($filePath)) {
                throw new HttpResponseException(response([
                    "message" => 'Uploaded file does not exist at the expected path.',
                ], Response::HTTP_NOT_FOUND));
            }

            // Read the Excel file
            $rows = $openSpout->readFileExcel(filePath: $filePath, sheetName: "DATA", useFirstRowAsKeyName: true);

            // Delete the file after reading
            Storage::delete(config('setting.other.path_to_temp') . '/' . $file->hashName());

            // If rows are empty
            if (empty($rows)) {
                throw new HttpResponseException(response([
                    "message" => 'No detail found',
                ], Response::HTTP_NOT_FOUND));
            }

            // begin trans
            DB::beginTransaction();

            // variables
            $line = 1;
            $logs = "";
            $inserted = 0;

            // loop rows
            foreach ($rows as $key => $row) {
                // replace value
                $row['is_active'] = match ($row['is_active']) {
                    'Y' => true,
                    'N' => false,
                    default => null,
                };

                // input validator
                $validator = Validator::make($row, (new WarehouseRequest())->rules());

                // if fails
                if ($validator->fails()) {
                    // add log
                    $logs .= "Line {$line}: " . PHP_EOL . GeneralHelper::prettyErrorMessage($validator->getMessageBag()) . PHP_EOL;

                    // increment
                    $line++;

                    // skip
                    continue;
                }

                // get validated data
                $validated = $validator->getData();

                // get data
                $isExist = Warehouse::whereRaw("LOWER(code)=?", [str($validated['code'])->lower()])->exists();

                // if exist then skip
                if ($isExist) {
                    // add log
                    $logs .= "Line {$line}: Code {$validated['code']} already exist." . PHP_EOL;

                    // increment
                    $line++;

                    // skip
                    continue;
                }

                // create new data
                Warehouse::create($row);

                // increment insert
                $inserted++;

                // add log
                $logs .= "Line {$line}: inserted." . PHP_EOL;

                // increment
                $line++;
            }

            // commit changes
            DB::commit();

            if ($inserted > 0) {
                return response()->json(["message" => "{$inserted} data successfully imported.", "logs" => $logs])->setStatusCode(Response::HTTP_CREATED);
            } else {
                return response()->json(["message" => "No data imported.", "logs" => $logs])->setStatusCode(Response::HTTP_BAD_REQUEST);
            }
        } catch (\Exception $e) {
            // rollback
            DB::rollBack();

            // throw error
            throw new HttpResponseException(response([
                "message" => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR));
        }
    }

    public function show(string $id): JsonResponse
    {
        // validate parameter
        $validated = Validator::make(['id' => $id], [
            'id' => ['required', "uuid", Rule::exists("warehouses", 'id')],
        ])->validated();

        // get data
        $data = Warehouse::where('id', $validated['id'])->select(['code', 'name', 'address', 'telephone', 'fax', 'is_active'])->first();

        // if data empty
        if (empty($data)) {
            throw new HttpResponseException(response([
                "message" => "Data not found.",
            ], Response::HTTP_NOT_FOUND));
        }

        return response()->json(['message' => Response::$statusTexts[Response::HTTP_OK], 'data' => $data])->setStatusCode(Response::HTTP_OK);
    }

    public function update(WarehouseRequest $request)
    {
        // validate request
        $validated = $request->validated();

        // check for duplicate
        $exist = Warehouse::where(function (Builder $query) use ($validated) {
            $query->whereRaw('LOWER(code)=?', [str($validated['code'])->lower()]);
        })->where('id', '!=', $validated['id'])->exists();

        // if exist then
        if ($exist) {
            throw new HttpResponseException(response([
                "errors" => [
                    "code" => [
                        "code already exist."
                    ],
                ],
                "message" => Response::$statusTexts[Response::HTTP_CONFLICT],
            ], Response::HTTP_CONFLICT));
        }

        // update
        $data = Warehouse::find($validated['id']);
        $data->fill($validated);
        $data->save();

        return response()->json(["message" => "Data successfully saved."])->setStatusCode(Response::HTTP_OK);
    }

    public function destroy(Request $request)
    {
        // handle input
        $ids = str($request->post('id'))->isJson() ? ['ids' => json_decode($request->post('id'), true)] : ['ids' => $request->post('id')];

        // validate request
        $validated = Validator::make($ids, [
            'ids' => ['required', "array"],
            'ids.*' => ['required', "uuid", Rule::exists('warehouses', 'id')],
        ])->validated();

        try {
            Warehouse::whereIn('id', $validated['ids'])->delete();

            return response()->json(["message" => count($validated['ids']) . " data successfully deleted."])->setStatusCode(Response::HTTP_OK);
        } catch (\Exception $e) {
            // throw error
            throw new HttpResponseException(response([
                "message" => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR));
        }
    }

    public function export(Request $request, OpenSpoutHelper $openSpout): JsonResponse
    {
        // prepare input
        $input = [
            'is_active' => empty($request->post('is_active')) ? null : filter_var($request->post('is_active'), FILTER_VALIDATE_BOOLEAN),
        ];

        // validate input
        $validated  = Validator::make($input, [
            "is_active" => ["nullable", "boolean"],
        ])->validated();

        // create query
        $query = Warehouse::select(['code', 'name', 'address', 'telephone', 'fax', 'is_active'])
            ->when(!is_null($validated['is_active']), function ($query) use ($validated) {
                return $query->where('is_active', filter_var($validated['is_active'], FILTER_VALIDATE_BOOLEAN));
            });

        // get data
        $records = $query->get()->toArray();

        // refactor data
        $records = array_map(function ($record) {
            // convert to array
            $record = (array) $record;

            // replace value
            $record['is_active'] = $record['is_active'] ? 'Yes' : 'No';

            return $record;
        }, $records);

        // variables
        $fileName = now()->format('YmdHis') . "_basics_warehouses.xlsx";
        $url = route('download-temp-file', ['fileNameEncoded' => base64_encode($fileName)]);

        // columns header
        $columns = [
            'no' => ['text' => 'No.', 'type' => 'serial', 'align' => 'left'],
            'code' => ['text' => 'Code', 'type' => 'string', 'align' => 'left'],
            'name' => ['text' => 'Name', 'type' => 'string', 'align' => 'left'],
            'address' => ['text' => 'Address', 'type' => 'string', 'align' => 'left'],
            'telephone' => ['text' => 'Telephone', 'type' => 'string', 'align' => 'left'],
            'fax' => ['text' => 'Fax', 'type' => 'string', 'align' => 'left'],
            'is_active' => ['text' => 'Active', 'type' => 'string', 'align' => 'left'],
        ];

        $openSpout->generateXlsx(
            filePath: config('setting.other.path_to_temp') . '/' . $fileName,
            columns: $columns,
            records: $records,
            useNumberFirstRow: true,
        );

        return response()->json(["url" => $url])->setStatusCode(Response::HTTP_OK);
    }

    public function lov(Request $request): View
    {
        // modal
        $data['title'] = 'Warehouse List';
        $data['srcURL'] = route('dt.basics.warehouses');
        $data['initSearch'] = $request->get('search');
        $data['queryParameters'] = Arr::query(['is_active' => $request->get('is_active') ?? true]);

        // datatable
        $data['columnHeaders'] = ['#', 'Code', 'Name', 'Address'];
        $data['columns'] = [
            ['data' => 'id', 'orderable' => false, 'visible' => false],
            ['data' => 'code', 'orderable' => true],
            ['data' => 'name', 'orderable' => true],
            ['data' => 'address', 'orderable' => true],
        ];
        $data['columnDefinitions'] = [];
        $data['columnOrders'] = [];
        $data['jsFile'] = Vite::asset('resources/js/pages/lov/common.js');

        return view('lov.common')->with(compact('data'));
    }
}
