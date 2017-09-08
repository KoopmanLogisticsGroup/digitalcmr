import {Interceptor, InterceptorInterface} from 'routing-controllers';

@Interceptor()
export class ComposerInterceptor implements InterceptorInterface {
  public intercept(request: any, response: any, content: any): any {
    if (!content && response) {
      return response.statusCode;
    } else {
      return content.body || content;
    }
  }
}
