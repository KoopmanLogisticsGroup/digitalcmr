import {Interceptor, InterceptorInterface, Action} from 'routing-controllers';

@Interceptor()
export class ComposerInterceptor implements InterceptorInterface {
  public intercept(action: Action, result: any): any {
    if (!result && action.response) {
      return action.response.statusCode;
    }
    return result.body || result;
  }
}
