import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';

import { CatalogsComponent } from './catalogs.component';
import { AccountServiceService } from 'src/app/services/account-service.service';
import { ApiServiceService } from 'src/app/services/product-service.service';
import { ThemeService } from 'src/app/services/theme.service';

describe('CatalogsComponent', () => {
  let component: CatalogsComponent;
  let fixture: ComponentFixture<CatalogsComponent>;
  let apiServiceSpy: jasmine.SpyObj<ApiServiceService>;
  let accountServiceSpy: jasmine.SpyObj<AccountServiceService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let themeSubject: BehaviorSubject<any>;
  const flushPromises = () => new Promise(resolve => setTimeout(resolve, 0));

  beforeEach(async () => {
    apiServiceSpy = jasmine.createSpyObj<ApiServiceService>('ApiServiceService', ['getLaunchedCatalogsPage']);
    apiServiceSpy.getLaunchedCatalogsPage.and.returnValue(Promise.resolve({
      items: [],
      filteredPaginationToken: null
    }));

    accountServiceSpy = jasmine.createSpyObj<AccountServiceService>('AccountServiceService', ['getOrgInfo']);
    accountServiceSpy.getOrgInfo.and.returnValue(Promise.resolve({}));
    themeSubject = new BehaviorSubject<any>(null);

    await TestBed.configureTestingModule({
      declarations: [CatalogsComponent],
      imports: [ReactiveFormsModule, RouterTestingModule, TranslateModule.forRoot()],
      providers: [
        { provide: ApiServiceService, useValue: apiServiceSpy },
        { provide: AccountServiceService, useValue: accountServiceSpy },
        {
          provide: ThemeService,
          useValue: {
            currentTheme$: themeSubject.asObservable()
          }
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    spyOn(routerSpy, 'navigate');
    fixture = TestBed.createComponent(CatalogsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should request the initial launched catalog page without a continuation token', async () => {
    apiServiceSpy.getLaunchedCatalogsPage.and.returnValue(
      Promise.resolve({ items: [{ id: 'catalog-1', name: 'Catalog 1' }], filteredPaginationToken: null })
    );

    await component.getProviders(false);

    expect(apiServiceSpy.getLaunchedCatalogsPage).toHaveBeenCalledTimes(1);
    expect(apiServiceSpy.getLaunchedCatalogsPage.calls.argsFor(0)).toEqual([0, undefined, component.CATALOG_LIMIT, null]);
    expect(component.providers.map(provider => provider.id)).toEqual(['catalog-1']);
    expect(component.page_check).toBeFalse();
  });

  it('should store the returned continuation token and show load more', async () => {
    apiServiceSpy.getLaunchedCatalogsPage.and.returnValues(
      Promise.resolve({ items: [{ id: 'catalog-1', name: 'Catalog 1' }], filteredPaginationToken: 'token-page-1' }),
      Promise.resolve({ items: [{ id: 'catalog-2', name: 'Catalog 2' }], filteredPaginationToken: 'token-page-2' })
    );

    await component.getProviders(false);

    expect(apiServiceSpy.getLaunchedCatalogsPage).toHaveBeenCalledTimes(2);
    expect(apiServiceSpy.getLaunchedCatalogsPage.calls.argsFor(1)).toEqual([
      component.CATALOG_LIMIT,
      undefined,
      component.CATALOG_LIMIT,
      'token-page-1'
    ]);
    expect(component.providers.map(provider => provider.id)).toEqual(['catalog-1']);
    expect(component.page_check).toBeTrue();
    expect((component as any).filteredPaginationToken).toBe('token-page-2');
  });

  it('should send the stored continuation token when loading more catalogs', async () => {
    apiServiceSpy.getLaunchedCatalogsPage.and.returnValues(
      Promise.resolve({ items: [{ id: 'catalog-1', name: 'Catalog 1' }], filteredPaginationToken: 'token-page-1' }),
      Promise.resolve({ items: [{ id: 'catalog-2', name: 'Catalog 2' }], filteredPaginationToken: 'token-page-2' }),
      Promise.resolve({ items: [{ id: 'catalog-3', name: 'Catalog 3' }], filteredPaginationToken: 'token-page-3' })
    );

    await component.getProviders(false);
    await component.next();

    expect(apiServiceSpy.getLaunchedCatalogsPage.calls.argsFor(2)).toEqual([
      component.CATALOG_LIMIT * 2,
      undefined,
      component.CATALOG_LIMIT,
      'token-page-2'
    ]);
    expect(component.providers.map(provider => provider.id)).toEqual(['catalog-1', 'catalog-2']);
    expect(component.page_check).toBeTrue();
    expect((component as any).filteredPaginationToken).toBe('token-page-3');
  });

  it('should reveal the prefetched page and disable load more when there is no further continuation token', async () => {
    apiServiceSpy.getLaunchedCatalogsPage.and.returnValues(
      Promise.resolve({ items: [{ id: 'catalog-1', name: 'Catalog 1' }], filteredPaginationToken: 'token-page-1' }),
      Promise.resolve({ items: [{ id: 'catalog-2', name: 'Catalog 2' }], filteredPaginationToken: null })
    );

    await component.getProviders(false);
    await component.next();

    expect(apiServiceSpy.getLaunchedCatalogsPage.calls.argsFor(1)).toEqual([
      component.CATALOG_LIMIT,
      undefined,
      component.CATALOG_LIMIT,
      'token-page-1'
    ]);
    expect(apiServiceSpy.getLaunchedCatalogsPage).toHaveBeenCalledTimes(2);
    expect(component.providers.map(provider => provider.id)).toEqual(['catalog-1', 'catalog-2']);
    expect(component.page_check).toBeFalse();
    expect((component as any).filteredPaginationToken).toBeNull();
  });

  it('should clear the continuation token when the search filter changes', async () => {
    (component as any).filteredPaginationToken = 'stale-token';
    component.searchField.setValue('cloud');
    apiServiceSpy.getLaunchedCatalogsPage.and.returnValues(
      Promise.resolve({ items: [{ id: 'catalog-1', name: 'Cloud catalog' }], filteredPaginationToken: null }),
      Promise.resolve({ items: [], filteredPaginationToken: null })
    );

    component.filterProviders();
    await flushPromises();

    expect(apiServiceSpy.getLaunchedCatalogsPage.calls.argsFor(0)).toEqual([0, 'cloud', component.CATALOG_LIMIT, null]);
    expect((component as any).filteredPaginationToken).toBeNull();
  });

  it('should reset the token and reload catalogs when sort changes', async () => {
    (component as any).filteredPaginationToken = 'stale-token';
    apiServiceSpy.getLaunchedCatalogsPage.and.returnValues(
      Promise.resolve({ items: [{ id: 'catalog-1', name: 'Cloud catalog' }], filteredPaginationToken: null }),
      Promise.resolve({ items: [], filteredPaginationToken: null })
    );

    component.selectSort('name_asc', new Event('click'));
    await flushPromises();

    expect(apiServiceSpy.getLaunchedCatalogsPage.calls.argsFor(0)).toEqual([0, undefined, component.CATALOG_LIMIT, null]);
    expect(component.sortOption).toBe('name_asc');
    expect((component as any).filteredPaginationToken).toBeNull();
  });

  it('should navigate to the selected catalog route', () => {
    component.goToProvider('cat-123');

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/search/catalogue', 'cat-123']);
  });

  it('should close the sort dropdown on document click', () => {
    component.showSortDropdown = true;
    const detectChangesSpy = spyOn((component as any).cdr, 'detectChanges');

    component.onClick();

    expect(component.showSortDropdown).toBeFalse();
    expect(detectChangesSpy).toHaveBeenCalled();
  });

  it('should detect long words and handle undefined values', () => {
    expect(component.hasLongWord('short words only', 20)).toBeFalse();
    expect(component.hasLongWord('this_contains_a_reallyreallyreallylongtoken', 10)).toBeTrue();
    expect(component.hasLongWord(undefined, 10)).toBeFalse();
  });
});
