<?php

namespace App\Http\Controllers\Account;

use App\Helpers\GeneralHelper;
use App\Http\Controllers\Controller;
use App\Models\Config\SignInHistory;
use App\Models\User;
use Illuminate\Contracts\View\View;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;
use Symfony\Component\HttpFoundation\Response;
use Yajra\DataTables\Facades\DataTables;

class ProfileController extends Controller
{
    public function changePasswordIndex(): View|RedirectResponse
    {
        // js
        GeneralHelper::addAdditionalJS([
            'resources/js/pages/account/change-password.js'
        ]);

        // set page title
        GeneralHelper::setTitle('Change Password', true);

        // set breadcrumb
        GeneralHelper::addAdditionalBreadCrumb(['Account', 'Change Password']);

        return view('account.change-password');
    }

    public function changePasswordSave(Request $request): JsonResponse
    {
        // values
        $values = [
            'password_old' => $request->input('password_old'),
            'password' => $request->input('password'),
            'password_confirmation' => $request->input('password_confirmation'),
        ];

        $password = !app()->isProduction() ? Password::min(6) : Password::min(8)->letters()->mixedCase()->numbers()->symbols()->uncompromised();

        // validate values
        $validated = Validator::make($values, [
            'password_old' => ['required', "string", 'max:150'],
            'password' => ['required', $password, 'max:150', "confirmed"],
        ])->validate();

        $user = User::where('id', Auth::id())->first();

        // check if old password is valid
        if (!Hash::check($validated["password_old"], $user->password)) {
            throw new HttpResponseException(response([
                "errors" => [
                    "password_old" => [
                        "Old password invalid."
                    ],
                ],
                "message" => "Invalid password.",
            ], Response::HTTP_UNPROCESSABLE_ENTITY));
        }

        // check if old password and new password is same
        if ($validated["password_old"] === $validated['password']) {
            throw new HttpResponseException(response([
                "errors" => [
                    "password_old" => [
                        "Old password and new password is cannot same."
                    ],
                    "password" => [
                        "Old password and new password is cannot same."
                    ],
                ],
                "message" => "Old password and new password is cannot same.",
            ], Response::HTTP_BAD_REQUEST));
        }

        // update password
        $user = User::find(Auth::id());
        $user->password = $validated['password'];
        $user->save();

        return response()->json(["message" => "Password successfully updated."])->setStatusCode(Response::HTTP_OK);
    }

    public function indexSignInHistory(): View|RedirectResponse
    {
        // js
        GeneralHelper::addAdditionalJS([
            'resources/js/pages/account/sign-in-history.js'
        ]);

        // set page title
        GeneralHelper::setTitle('Sign In History', true);

        // set breadcrumb
        GeneralHelper::addAdditionalBreadCrumb(['Account', 'Sign In History']);

        return view('account.sign-in-history');
    }

    public function datatableSignInHistory(Request $request): JsonResponse
    {
        if (!Auth::check()) {
            abort(Response::HTTP_UNAUTHORIZED);
        }

        $startDate = Carbon::parse($request->get('start_date'))->format('Y-m-d');
        $endDate = Carbon::parse($request->get('end_date'))->format('Y-m-d');

        $model = SignInHistory::select(['id', 'ip', 'os', 'platform', 'browser', 'country', 'city', 'created_at'])
            ->where('user_id', Auth::id())
            ->whereBetween(DB::raw('DATE(created_at)'), [$startDate, $endDate]);

        return DataTables::eloquent($model)->toJson();
    }

    public function indexActivity(): View|RedirectResponse
    {
        // js
        GeneralHelper::addAdditionalJS([
            'resources/js/pages/account/activity-history.js'
        ]);

        // set page title
        GeneralHelper::setTitle('Aktifitas', true);

        // set breadcrumb
        GeneralHelper::addAdditionalBreadCrumb(['Account', 'Aktifitas']);

        return view('account.activity-history');
    }

    public function profileIndex(): View|RedirectResponse
    {
        // js
        GeneralHelper::addAdditionalJS([
            'resources/js/pages/account/change-profile.js'
        ]);

        // set page title
        GeneralHelper::setTitle('Change Profile', true);

        // set breadcrumb
        GeneralHelper::addAdditionalBreadCrumb(['Account', 'Change Profile']);

        // get timezone
        $timezones = GeneralHelper::getTimezone();

        // check if user already verified email
        if (Auth::user()->hasVerifiedEmail()) {
            return view('account.change-profile')->with(compact('timezones'));
        }

        return redirect()->route('verification.notice');
    }

    public function profileSave(Request $request): JsonResponse
    {
        // get user
        $user = Auth::user();

        // validator rules
        $validator = Validator::make($request->all(), [
            "email" => ["required", "min:8", "max:255", 'email', Rule::unique('users', 'email')->ignore($user->id, 'id')],
            "name" => ["required", "string", "min:3", "max:255"],
            "timezone" => ["required", 'timezone'],
        ]);

        // jika gagal
        if ($validator->fails()) {
            throw new HttpResponseException(response([
                "errors" => $validator->errors(),
                "message" => "Duplicate",
            ], Response::HTTP_BAD_REQUEST));
        }

        // Retrieve the validated input
        $validated = $validator->validated();

        // update
        $user = User::find($user->id);
        $user->fill($validated);
        $user->save();

        // set session
        Session::put('name', $user->name);
        Session::put('email', $user->email);
        Session::put('timezone', $user->timezone);

        return response()->json(["message" => "Profile has been updated."])->setStatusCode(Response::HTTP_OK);
    }

    public function profileInfo(): JsonResponse
    {
        // get user
        $user = User::where('id', Auth::id())->with(['role:id,name'])->first(['email', 'name', 'timezone', 'last_login_at', 'updated_at', 'last_change_password_at']);

        return response()->json(["message" => Response::$statusTexts[Response::HTTP_OK], 'data' => $user])->setStatusCode(Response::HTTP_OK);
    }
}