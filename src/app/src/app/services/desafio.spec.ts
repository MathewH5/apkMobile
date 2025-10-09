import { TestBed } from '@angular/core/testing';

import { Desafio } from './desafio';

describe('Desafio', () => {
  let service: Desafio;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Desafio);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
