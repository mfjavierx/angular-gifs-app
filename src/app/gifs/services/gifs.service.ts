import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Gif, SearchResponse } from "../interfaces/gifs.interfaces";

const GIPHY_URL = `https://api.giphy.com/v1/gifs`;
const GIPHY_API_KEY = 'mStgedXJAZaLzaiFhnTMyI3lz6FLSKtZ';
const GIPHY_LIMIT = 10;

@Injectable({
  providedIn: 'root'
})
export class GifsService {
  public gifsList: Gif[] = [];

  private _tagsHistory: string[] = [];

  public get tagsHistory() {
    return [...this._tagsHistory];
  }

  constructor(private http: HttpClient) {
    this.loadLocalStorage();
    this.searchFirstFromHistory();
  }

  public searchTag(tag: string): void {
    if (tag.length === 0) { return; }

    this.organizeHistory(tag);

    const params = new HttpParams()
      .set('api_key', GIPHY_API_KEY)
      .set('limit', GIPHY_LIMIT)
      .set('q', tag);

    this.http.get<SearchResponse>(`${GIPHY_URL}/search`, { params })
      .subscribe(resp => {
        this.gifsList = resp.data;
      });
  }

  private organizeHistory(tag: string): void {
    tag = tag.toLocaleLowerCase();

    if (this._tagsHistory.includes(tag)) {
      this._tagsHistory = this._tagsHistory.filter((oldTag) => oldTag !== tag);
    }

    this._tagsHistory.unshift(tag);

    this._tagsHistory = this._tagsHistory.splice(0, 10);

    this.saveLocalStorage();
  }

  private saveLocalStorage(): void {
    localStorage.setItem('history', JSON.stringify(this._tagsHistory));
  }

  private loadLocalStorage(): void {
    if (!localStorage.getItem('history')) { return; }

    this._tagsHistory = JSON.parse(localStorage.getItem('history')!);
  }

  private searchFirstFromHistory(): void {
    if (this._tagsHistory.length === 0) { return; }

    this.searchTag(this._tagsHistory[0]);
  }
}
