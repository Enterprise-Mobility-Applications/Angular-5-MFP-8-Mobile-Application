import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/authentication/login/login.component';
import { RegistrationComponent } from './components/authentication/registration/registration.component';
import { SetPasswordComponent } from './components/authentication/set-password/set-password.component';
import { SuccessComponent } from './shared/components/success/success.component';
import { OtpComponent } from './components/authentication/otp/otp.component';
import { ForgotPasswordComponent } from './components/authentication/forgot-password/forgot-password.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { HeaderComponent } from './shared/components/header/header.component';
import { SelectRoleComponent } from './components/authentication/select-role/select-role.component';
import { RegistrationDetailsComponent } from './components/authentication/registration-details/registration-details.component';
import { AuthActivateGuard } from './authactivate.guard';
import { ProfileComponent } from './components/dashboard/profile/profile.component';
import { UpdateAadharInfoComponent } from './components/aadhar/update-aadhar-info/update-aadhar-info.component';
import { SelectAadharFlowComponent } from './components/aadhar/select-aadhar-flow/select-aadhar-flow.component';
import { SelectEnrollmentFlowComponent } from './components/aadhar/select-enrollment-flow/select-enrollment-flow.component';
import { ValidateAadhaarDetailsComponent } from './components/aadhar/validate-aadhaar-details/validate-aadhaar-details.component';
import { ValidateAadhaarOtpComponent } from './components/aadhar/validate-aadhaar-otp/validate-aadhaar-otp.component';
import { AadhaarConfirmationComponent } from './components/aadhar/aadhaar-confirmation/aadhaar-confirmation.component';
import { UploadAadhaarFlowComponent } from './components/aadhar/upload-aadhaar-flow/upload-aadhaar-flow.component';
import { ProfileAdvisorComponent } from './components/dashboard/profile-advisor/profile-advisor.component';
import { ProfileEmployeeComponent } from './components/dashboard/profile-employee/profile-employee.component';
import { DashboardEmployeeComponent } from './components/dashboard/dashboard-employee/dashboard-employee.component';
import { DashboardAdvisorComponent } from './components/dashboard/dashboard-advisor/dashboard-advisor.component';
import { PreviewDataComponent } from './components/aadhar/preview-data/preview-data.component';
import { PreviewDataConfirmComponent } from './components/aadhar/preview-data-confirm/preview-data-confirm.component';
import { DashboardHomeComponent } from './components/dashboard/dashboard-home/dashboard-home.component';
import { UpdateAadharNumberComponent } from './components/branch/update-aadhar-number/update-aadhar-number.component';
import { BranchValidateAadhaarOtpComponent } from './components/branch/branch-validate-aadhaar-otp/branch-validate-aadhaar-otp.component';
import { BranchUploadDocComponent } from './components/branch/branch-upload-doc/branch-upload-doc.component';
import { ValidateClientDetailsComponent } from './components/branch/validate-client-details/validate-client-details.component';
import { ValidateOtpAdvisorComponent } from './components/advisor/validate-otp-advisor/validate-otp-advisor.component';
import { BranchEditAddressComponent } from './components/branch/branch-edit-address/branch-edit-address.component';

const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegistrationComponent },
    { path: 'regDetails', component: RegistrationDetailsComponent },
    { path: 'setPassword', component: SetPasswordComponent },
    { path: 'successPage', component: SuccessComponent },
    { path: 'otp', component: OtpComponent },
    { path: 'selectRole', component: SelectRoleComponent },
    { path: 'forgotPassword', component: ForgotPasswordComponent },
    { path: 'dashboardHome', component: DashboardHomeComponent, canActivate: [AuthActivateGuard] },
    { path: 'profile', component: ProfileComponent, canActivate: [AuthActivateGuard] },
    { path: 'selectAadharFlow', component: SelectAadharFlowComponent, canActivate: [AuthActivateGuard] },
    { path: 'aadharValidationType', component: UpdateAadharInfoComponent, canActivate: [AuthActivateGuard] },
    { path: 'selectEnrollmentFlow', component: SelectEnrollmentFlowComponent, canActivate: [AuthActivateGuard] },
    { path: 'validateAadhaarDetails', component: ValidateAadhaarDetailsComponent, canActivate: [AuthActivateGuard] },
    { path: 'validateAadhaarOTP', component: ValidateAadhaarOtpComponent, canActivate: [AuthActivateGuard] },
    { path: 'aadhaarConfirmation', component: AadhaarConfirmationComponent, canActivate: [AuthActivateGuard] },
    { path: 'uploadAadhaarFlow', component: UploadAadhaarFlowComponent, canActivate: [AuthActivateGuard] },
    { path: 'advisorProfile', component: ProfileAdvisorComponent, canActivate: [AuthActivateGuard] },
    { path: 'employeeProfile', component: ProfileEmployeeComponent, canActivate: [AuthActivateGuard] },
    { path: 'employeeDashboard', component: DashboardEmployeeComponent, canActivate: [AuthActivateGuard] },
    { path: 'advisorDashboard', component: DashboardAdvisorComponent, canActivate: [AuthActivateGuard] },
    { path: 'previewData', component: PreviewDataComponent, canActivate: [AuthActivateGuard] },
    { path: 'updateAadharNumberBranch', component: UpdateAadharNumberComponent, canActivate: [AuthActivateGuard] },
    { path: 'previewDataConfirm', component: PreviewDataConfirmComponent, canActivate: [AuthActivateGuard] },
    { path: 'branchValidateAadhaarOtp', component: BranchValidateAadhaarOtpComponent, canActivate: [AuthActivateGuard] },
    { path: 'branchUploadDoc', component: BranchUploadDocComponent },
    { path: 'validateClientDetails', component: ValidateClientDetailsComponent, canActivate: [AuthActivateGuard] },
    { path: 'validateOTPAdvisor', component: ValidateOtpAdvisorComponent, canActivate: [AuthActivateGuard] },
    { path: 'branchEditAddress', component:BranchEditAddressComponent },
  ];

  @NgModule({
    imports: [
      RouterModule.forRoot(routes)
    ],
  exports: [
      RouterModule
  ],
    declarations: []
  })

  export class AppRoutingModule { }
