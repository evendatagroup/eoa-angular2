import { Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { HttpInterceptor, HttpRequest, HttpHandler,
         HttpSentEvent, HttpHeaderResponse, HttpProgressEvent, HttpResponse, HttpUserEvent,
       } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { catchError } from 'rxjs/operators';
import { mergeMap } from 'rxjs/operators';
import { environment } from '@env/environment';
import { NzMessageService } from 'ng-zorro-antd';

/**
 * 默认HTTP拦截器，其注册细节见 `app.module.ts`
 */
@Injectable()
export class DefaultInterceptor implements HttpInterceptor {
    constructor(private injector: Injector) {}

    get msg(): NzMessageService {
        return this.injector.get(NzMessageService);
    }

    private goLogin() {
        const router = this.injector.get(Router);
        this.injector.get(Router).navigate([ '/passport/login' ]);
    }

    intercept(req: HttpRequest<any>, next: HttpHandler):
        Observable<HttpSentEvent | HttpHeaderResponse | HttpProgressEvent | HttpResponse<any> | HttpUserEvent<any>> {

        // 统一加上服务端前缀
        let url = req.url;
        if (!url.startsWith('https://') && !url.startsWith('http://')) {
            if (url.endsWith('.json')) { url = environment.SERVER_URL + url; }
            else {
                url = environment.HTTP_URL + url;
            }

        }

        const newReq = req.clone({
            url: url
        });

        return next.handle(newReq).pipe(
                    mergeMap((event: any) => {
                        // 允许统一对请求错误处理，这是因为一个请求若是业务上错误的情况下其HTTP请求的状态是200的情况下需要
                        if (event instanceof HttpResponse && event.body.error_code!==undefined && event.body.error_code !== "0") {
                            // 业务处理：observer.error 会跳转至后面的 `catch`
                            this.msg.error(event.body.msg);
                            return ErrorObservable.create(event);
                        }
                        // 若一切都正常，则后续操作
                        return of(event);
                    }),
                    catchError((res: HttpResponse<any>) => {
                        if(res.body.error_code=='501'||res.body.error_code=='502'||res.body.error_code=='503'||res.body.error_code=='504'){
                          localStorage.clear();
                          this.goLogin();
                        }
                        // 业务处理：一些通用操作
                        switch (res.status) {
                            case 401: // 未登录状态码
                                this.msg.error('重新登陆');
                                this.goLogin();
                                break;
                            case 200:
                                // 业务层级错误处理
                                this.msg.error('业务错误');
                                break;
                            case 404:
                                // 404
                                break;
                        }
                        // 返回错误状态码
                        return of(<any>{ status: res.status });
                    })
                );
    }
}
