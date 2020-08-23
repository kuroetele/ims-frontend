import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Subject} from 'rxjs/';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AlertService, AppService, CategoryService} from '../_services/index';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';

class CategoryGrid {
  id: number;
  name: string;
  description: string;
  status: string;
  deleted: boolean;
}

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html'
})
export class CategoryComponent implements OnInit {

  dtOptions: DataTables.Settings = {}; //  DataTable
  dtTrigger = new Subject(); //  DataTable
  categoryList: CategoryGrid[] = []; // Table Data list
  categoryAddForm: FormGroup;
  getCat = {
    id: '',
    name: '',
    description: '',
    deleted: false,
  };
  modalReference: NgbActiveModal;
  modalTitle: string;
  cat = {
    id: '',
    name: '',
    description: '',
    deleted: false,
  };
  showloding = true;
  lodingImage = false;

  constructor(
    public router: Router,
    private dataService: CategoryService,
    private alertService: AlertService,
    private appService: AppService,
    private modalService: NgbModal
  ) {
  }

  ngOnInit() {

    setTimeout(() => {
      this.showloding = false;
      this.lodingImage = true;
    }, 500);

    this.categoryAddForm = new FormGroup({
      name: new FormControl('', Validators.compose([Validators.required])),
      description: new FormControl(''),
      deleted: new FormControl('')
    });

    this.allCategory();
  }

  allCategory() {
    this.dataService.getAllCategory()
      .pipe().subscribe(data => {
      this.categoryList = (data as any).data;
      this.dtTrigger.next(); // Data Table
    });
  }

  open(content) {

    if (this.getCat.id != null) {
      this.getCat.id = '';
    }
    this.cat.deleted = false;
    this.modalTitle = 'Add Category';
    this.resetCat();
    this.modalReference = this.modalService.open(content);
  }

  edit(id, content) {
    this.loadShow();
    this.dataService.getCategory(id)
      .pipe().subscribe(data => {
      this.getCat = (data as any).data;
      this.cat = {
        id: this.getCat.id,
        name: this.getCat.name,
        description: this.getCat.description,
        deleted: this.getCat.deleted
      };
      this.loadHide();
      this.modalTitle = 'Edit Category';
      this.modalReference = this.modalService.open(content);
    });

  }

  save(val) {
    // this.customer.id;
    if (!val.id) {
      this.dataService.save(this.cat)
        .pipe().subscribe(data => {
        this.modalReference.close();
        this.dtTrigger = new Subject(); //  DataTable
        this.alertService.success('Category Create successful', true);
        this.allCategory();
      }, error => {
        this.alertService.error(error);
      });
    } else {
      this.dataService.categoryUpdate(this.cat)
        .pipe().subscribe(data => {
        this.modalReference.close();
        this.dtTrigger = new Subject(); //  DataTable
        this.alertService.success('Category Update successful', true);
        this.allCategory();
      }, error => {
        this.alertService.error(error);
      });
    }
  }

  delete(id) {
    if (confirm('Are you sure to delete')) {
      this.dataService.categoryDelete(id)
        .pipe().subscribe(data => {
        this.dtTrigger = new Subject(); //  DataTable
        this.alertService.success('Category Delete successful', true);
        this.allCategory();
      }, error => {
        this.alertService.error(error);
      });
    }
  }

  loadShow() {
    this.showloding = true;
    this.lodingImage = false;
  }

  loadHide() {
    this.showloding = false;
    this.lodingImage = true;
  }

  resetCat() {
    this.cat.id = null;
    this.cat.name = null;
    this.cat.description = null;
  }
}
