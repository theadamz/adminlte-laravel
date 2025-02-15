<?php

namespace App\Http\Controllers\Basic;

use App\Helpers\GeneralHelper;
use App\Helpers\OpenSpoutHelper;
use App\Http\Controllers\Controller;
use App\Http\Requests\Basic\WarehouseLocationRequest;
use App\Models\Basic\Warehouse;
use App\Models\Basic\WarehouseLocation;
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

class WarehouseLocationController extends Controller
{
    protected string $templateName = "template_warehouse_locations.xlsx";

    public function index(string $warehouseId): View
    {
        // check if warehouse exist
        if (!Warehouse::where('id', $warehouseId)->exists()) {
            abort(Response::HTTP_NOT_FOUND);
        }

        // js
        GeneralHelper::addAdditionalJS([
            'resources/js/pages/basic/warehouse-location.js'
        ]);

        // template name
        $templateName = $this->templateName;

        // get warehouse
        $warehouseName = Warehouse::where('id', $warehouseId)->value("name");

        // add breadcrumb
        GeneralHelper::addAdditionalBreadCrumb([$warehouseName, 'Locations']);

        // set title
        GeneralHelper::setTitle('Warehouse Locations');

        return view('basic.warehouse-location')->with(compact('templateName', 'warehouseId'));
    }

    public function datatable(Request $request, string $warehouseId): JsonResponse
    {
        $queries = DB::table("warehouse_locations", "wl")->selectRaw("wl.id, w.name AS warehouse_name, wl.code, wl.name, wl.description, wl.is_active")
            ->leftJoin("warehouses AS w", "w.id", "=", "wl.warehouse_id")
            ->where('wl.warehouse_id', $warehouseId)
            ->when($request->filled('is_active'), function ($query) use ($request) {
                return $query->where('wl.is_active', filter_var($request->get('is_active'), FILTER_VALIDATE_BOOLEAN));
            });

        return DataTables::query($queries)->toJson();
    }

    public function store(WarehouseLocationRequest $request): JsonResponse
    {
        // validate request
        $validated = $request->validated();

        // check for duplicate
        $exist = WarehouseLocation::where(function (Builder $query) use ($validated) {
            $query->whereRaw('LOWER(code)=?', [str($validated['code'])->lower()]);
        })->where('warehouse_id', $validated['warehouse'])->exists();

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
        $data = new WarehouseLocation($validated);
        $data->warehouse_id = $validated['warehouse'];
        $data->save();

        return response()->json(["message" => "Data successfully created."])->setStatusCode(Response::HTTP_CREATED);
    }

    public function show(string $warehouseId, string $id): JsonResponse
    {
        // validate parameter
        $validated = Validator::make(['id' => $id], [
            'id' => ['required', "uuid", Rule::exists("warehouse_locations", 'id')->where('warehouse_id', $warehouseId)],
        ])->validated();

        // get data
        $data = WarehouseLocation::where('id', $validated['id'])->where('warehouse_id', $warehouseId)->select(['code', 'name', 'description', 'is_active'])->first();

        // if data empty
        if (empty($data)) {
            throw new HttpResponseException(response([
                "message" => "Data not found.",
            ], Response::HTTP_NOT_FOUND));
        }

        return response()->json(['message' => Response::$statusTexts[Response::HTTP_OK], 'data' => $data])->setStatusCode(Response::HTTP_OK);
    }

    public function update(WarehouseLocationRequest $request): JsonResponse
    {
        // validate request
        $validated = $request->validated();

        // check for duplicate
        $exist = WarehouseLocation::where(function (Builder $query) use ($validated) {
            $query->whereRaw('LOWER(code)=?', [str($validated['code'])->lower()]);
        })->where('warehouse_id', $validated['warehouse'])->where('id', '!=', $validated['id'])->exists();

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
        $data = WarehouseLocation::find($validated['id']);
        $data->fill($validated);
        $data->warehouse_id = $validated['warehouse'];
        $data->save();

        return response()->json(["message" => "Data successfully saved."])->setStatusCode(Response::HTTP_OK);
    }

    public function destroy(Request $request, string $warehouseId): JsonResponse
    {
        // handle input
        $ids = str($request->post('id'))->isJson() ? json_decode($request->post('id'), true) : $request->post('id');
        $input = [
            'warehouse' => $warehouseId,
            'ids' => $ids,
        ];

        // validate request
        $validated = Validator::make($input, [
            'warehouse' => ['required', "uuid", Rule::exists('warehouses', 'id')],
            'ids' => ['required', "array"],
            'ids.*' => ['required', "uuid", Rule::exists('warehouse_locations', 'id')->where('warehouse_id', $warehouseId)],
        ])->validated();

        try {
            WarehouseLocation::whereIn('id', $validated['ids'])->delete();

            return response()->json(["message" => count($validated['ids']) . " data successfully deleted."])->setStatusCode(Response::HTTP_OK);
        } catch (\Exception $e) {
            // throw error
            throw new HttpResponseException(response([
                "message" => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR));
        }
    }

    public function import(Request $request, OpenSpoutHelper $openSpout, string $warehouseId): JsonResponse
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
            $filePath = config('setting.other.path_to_temp') . '/' . $file->hashName();

            // Check if the file exists
            if (!Storage::disk('local')->exists($filePath)) {
                throw new HttpResponseException(response([
                    "message" => 'Uploaded file does not exist at the expected path.',
                ], Response::HTTP_NOT_FOUND));
            }

            // Read the Excel file
            $rows = $openSpout->readFileExcel(filePath: Storage::disk('local')->path($filePath), sheetName: "DATA", useFirstRowAsKeyName: true);

            // Delete the file after reading
            Storage::disk('local')->delete($filePath);

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
                $row['warehouse'] = $warehouseId;

                // input validator
                $validator = Validator::make($row, (new WarehouseLocationRequest())->rules());

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
                $isExist = WarehouseLocation::whereRaw("LOWER(code)=?", [str($validated['code'])->lower()])->where('warehouse_id', $warehouseId)->exists();

                // if exist then skip
                if ($isExist) {
                    // add log
                    $logs .= "Line {$line}:" . PHP_EOL . "Code {$validated['code']} already exist." . PHP_EOL . PHP_EOL;

                    // increment
                    $line++;

                    // skip
                    continue;
                }

                // create new data
                WarehouseLocation::create([
                    'warehouse_id' => $warehouseId,
                    'code' => $validated['code'],
                    'name' => $validated['name'],
                    'description' => $validated['description'],
                    'is_active' => $validated['is_active'],
                ]);

                // increment insert
                $inserted++;

                // add log
                $logs .= "Line {$line}:" . PHP_EOL . "inserted." . PHP_EOL . PHP_EOL;

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

    public function export(Request $request, OpenSpoutHelper $openSpout, string $warehouseId): JsonResponse
    {
        // prepare input
        $input = [
            'warehouse' => $warehouseId,
            'is_active' => empty($request->post('is_active')) ? null : filter_var($request->post('is_active'), FILTER_VALIDATE_BOOLEAN),
        ];

        // validate input
        $validated  = Validator::make($input, [
            'warehouse' => ['required', "uuid", Rule::exists('warehouses', 'id')],
            "is_active" => ["nullable", "boolean"],
        ])->validated();

        // create query
        $query = WarehouseLocation::select(['code', 'name', 'description', 'is_active', 'warehouse_id'])->where('warehouse_id', $validated['warehouse'])
            ->with('warehouse:id,name')
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
            $record['warehouse_name'] = $record['warehouse']['name'];

            return $record;
        }, $records);

        // variables
        $fileName = now()->format('YmdHis') . "_basics_warehouse_locations.xlsx";
        $fileNameWithPath = config('setting.other.path_to_temp') . '/' . $fileName;

        // columns header
        $columns = [
            'no' => ['text' => 'No.', 'type' => 'serial', 'align' => 'left'],
            'warehouse_name' => ['text' => 'Warehouse', 'type' => 'string', 'align' => 'left'],
            'code' => ['text' => 'Code', 'type' => 'string', 'align' => 'left'],
            'name' => ['text' => 'Name', 'type' => 'string', 'align' => 'left'],
            'description' => ['text' => 'Description', 'type' => 'string', 'align' => 'left'],
            'is_active' => ['text' => 'Active', 'type' => 'string', 'align' => 'left'],
        ];

        $openSpout->generateXlsx(
            filePath: Storage::disk('local')->path($fileNameWithPath),
            columns: $columns,
            records: $records,
            useNumberFirstRow: true,
        );

        // generate url
        $url = route('download-temp-file', ['fileNameEncoded' => base64_encode($fileName)]);

        return response()->json(["url" => $url])->setStatusCode(Response::HTTP_OK);
    }

    public function lov(Request $request, string $warehouseId): View
    {
        // modal
        $data['title'] = 'Warehouse Location List';
        $data['srcURL'] = route('dt.basics.warehouses.locations', ['warehouseId' => $warehouseId]);
        $data['initSearch'] = $request->get('search');
        $data['queryParameters'] = Arr::query(['is_active' => $request->get('is_active') ?? true]);

        // datatable
        $data['columnHeaders'] = ['#', 'Warehouse', 'Code', 'Name'];
        $data['columns'] = [
            ['data' => 'id', 'orderable' => false, 'visible' => false],
            ['data' => 'warehouse_name', 'name' => 'w.name', 'orderable' => true],
            ['data' => 'code', 'orderable' => true],
            ['data' => 'name', 'orderable' => true],
        ];
        $data['columnDefinitions'] = [];
        $data['columnOrders'] = [];
        $data['jsFile'] = 'resources/js/pages/lov/common.js';

        return view('lov.common')->with(compact('data'));
    }
}
