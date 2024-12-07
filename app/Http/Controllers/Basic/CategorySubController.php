<?php

namespace App\Http\Controllers\Basic;

use App\Helpers\GeneralHelper;
use App\Helpers\OpenSpoutHelper;
use App\Http\Controllers\Controller;
use App\Http\Requests\Basic\CategorySubRequest;
use App\Models\Basic\Category;
use App\Models\Basic\CategorySub;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\File;
use Symfony\Component\HttpFoundation\Response;
use Yajra\DataTables\Facades\DataTables;

class CategorySubController extends Controller
{
    protected string $templateName = "template_category_subs.xlsx";

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // js
        GeneralHelper::addAdditionalJS([
            'resources/js/pages/basic/category-sub.js'
        ]);

        // template name
        $templateName = $this->templateName;

        return view('basic.category-sub')->with(compact('templateName'));
    }

    public function datatable(Request $request): JsonResponse
    {
        $queries = DB::table("category_subs", "cs")->leftJoin("categories AS c", "c.id", "=", "cs.category_id")
            ->selectRaw("cs.id, c.name AS category_name, cs.code, cs.name, cs.is_active")
            ->when($request->filled('is_active'), function ($query) use ($request) {
                return $query->where('cs.is_active', filter_var($request->get('is_active'), FILTER_VALIDATE_BOOLEAN));
            });

        return DataTables::query($queries)->toJson();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(CategorySubRequest $request): JsonResponse
    {
        // validate request
        $validated = $request->validated();

        // check for duplicate
        $exist = CategorySub::where(function (Builder $query) use ($validated) {
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
        $data = new CategorySub($validated);
        $data->category_id = $validated['category'];
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
                $validator  = Validator::make($row, [
                    'category_code' => ['required', 'string', Rule::exists("categories", "code")],
                    'code' => ['required', 'string', 'min:1', 'max:10', "regex:" . config("setting.regxp.forCode")],
                    'name' => ['required', 'string', 'min:3', 'max:100'],
                    "is_active" => ["required", "boolean"],
                ]);

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
                $categorySubExist = CategorySub::whereRaw("LOWER(code)=?", [str($validated['code'])->lower()])->exists();

                // if not empty then do not insert
                if (!empty($categorySubExist)) {
                    // add log
                    $logs .= "Line {$line}: Code {$validated['code']} already exist." . PHP_EOL;

                    // increment
                    $line++;

                    // skip
                    continue;
                }

                // create new data
                CategorySub::create([
                    'category_id' => Category::where('code', $validated['category_code'])->value('id'),
                    'code' => $validated['code'],
                    'name' => $validated['name'],
                    'is_active' => $validated['is_active'],
                ]);

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

    /**
     * Display the specified resource.
     */
    public function show(string $id): JsonResponse
    {
        // validate parameter
        $validated = Validator::make(['id' => $id], [
            'id' => ['required', "uuid", Rule::exists("category_subs", 'id')],
        ])->validated();

        // get data
        $data = CategorySub::where('id', $validated['id'])->select(['category_id', 'code', 'name', 'is_active'])->with(['category:id,name'])->first();

        // if data empty
        if (empty($data)) {
            throw new HttpResponseException(response([
                "message" => "Data not found.",
            ], Response::HTTP_NOT_FOUND));
        }

        return response()->json(['message' => Response::$statusTexts[Response::HTTP_OK], 'data' => $data])->setStatusCode(Response::HTTP_OK);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(CategorySubRequest $request)
    {
        // validate request
        $validated = $request->validated();

        // check for duplicate
        $exist = CategorySub::where(function (Builder $query) use ($validated) {
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
        $data = CategorySub::find($validated['id']);
        $data->fill($validated);
        $data->category_id = $validated['category'];
        $data->save();

        return response()->json(["message" => "Data successfully saved."])->setStatusCode(Response::HTTP_OK);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request)
    {
        // handle input
        $ids = str($request->post('id'))->isJson() ? ['ids' => json_decode($request->post('id'), true)] : ['ids' => $request->post('id')];

        // validate request
        $validated = Validator::make($ids, [
            'ids' => ['required', "array"],
            'ids.*' => ['required', "uuid", Rule::exists('category_subs', 'id')],
        ])->validated();

        try {
            CategorySub::whereIn('id', $validated['ids'])->delete();

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
        $query = CategorySub::select(['category_id', 'code', 'name', 'is_active'])->with(['category:id,name'])
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

            // add new key and value
            $record['category_name'] = $record['category']['name'];

            return $record;
        }, $records);

        // variables
        $fileName = now()->format('YmdHis') . "_basics_category_subs.xlsx";
        $url = route('download-temp-file', ['fileNameEncoded' => base64_encode($fileName)]);

        // columns header
        $columns = [
            'no' => ['text' => 'No.', 'type' => 'serial', 'align' => 'left'],
            'category_name' => ['text' => 'Category', 'type' => 'string', 'align' => 'left'],
            'code' => ['text' => 'Code', 'type' => 'string', 'align' => 'left'],
            'name' => ['text' => 'Name', 'type' => 'string', 'align' => 'left'],
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
}
