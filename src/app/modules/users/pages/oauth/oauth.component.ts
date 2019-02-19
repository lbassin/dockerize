import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../../core/services/api.service';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthenticationService } from '../../../../core/authentication/authentication.service';

@Component({
    selector: 'app-oauth',
    templateUrl: './oauth.component.html',
    styleUrls: ['./oauth.component.scss']
})
export class OauthComponent implements OnInit {

    loading = true;
    error = false;

    constructor(private route: ActivatedRoute, private api: ApiService, private router: Router, private authenticationService: AuthenticationService) {
    }

    ngOnInit() {
        const provider = this.route.snapshot.params.provider;

        const authFunctions = {
            'github': this.loginWithGithub
        };

        try {
            authFunctions[provider]();
        } catch (error) {
            this.handleError(error);
        }
    }

    private handleSuccess(response: { token: string }): void {
        this.authenticationService.login(response.token);
        this.router.navigate(['/', 'users', 'profile']);

        this.loading = false;
        this.error = false;
    }

    private handleError(error): void {
        console.error(error);
        this.loading = false;
        this.error = true;
    }

    private loginWithGithub = (): void => {
        const code = this.route.snapshot.queryParams.code;
        const state = this.route.snapshot.queryParams.state;

        if (localStorage.getItem('api_state') !== state) {
            throw new Error('Auth failed');
        }
        localStorage.removeItem('api_state');

        this.api.post('login', {code: code, state: state})
            .subscribe(
                (response: { token: string }) => this.handleSuccess(response),
                (error: HttpErrorResponse) => this.handleError(error)
            );
    }
}