import {Injectable} from '@angular/core';
import {Container} from '../models/container.model';
import {HttpClient} from '@angular/common/http';
import {Config} from '../app.vars';

@Injectable()
export class ContainerService {

  constructor(private http: HttpClient) {
  }

  public getAvailableContainers(): Promise<Array<Container>> {
    return new Promise(resolve => {
      const url = Config.GIT_URL + Config.GIT_CONTAINERS_PATH;

      const promises: Array<Promise<Container>> = [];
      this.http.get(url).subscribe((data: Array<any>) => {
        data.map(container => {
          promises.push(this.getContainerConfig(container.name));
        });

        Promise.all(promises).then(containers => {
          resolve(containers);
        });
      });
    });
  }

  public getContainerConfig(name: string): Promise<Container> {
    const url = Config.GIT_URL + Config.GIT_CONTAINERS_PATH + '/' + name;

    return new Promise<Container>((resolve, reject) => {
      this.http.get(url).subscribe((file: { name: string, content: string }) => {
        const content = atob(file.content);
        const container: Container = YAML.parse(content);
        container.configPath = file.name;

        resolve(container);
      }, () => {
        reject(null);
      });
    });
  }
}
