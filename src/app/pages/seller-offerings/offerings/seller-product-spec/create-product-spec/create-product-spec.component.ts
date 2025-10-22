import { Component, OnInit, ChangeDetectorRef, HostListener, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {components} from "src/app/models/product-catalog";
import { environment } from 'src/environments/environment';
import { ApiServiceService } from 'src/app/services/product-service.service';
import { ProductSpecServiceService } from 'src/app/services/product-spec-service.service';
import {LocalStorageService} from "src/app/services/local-storage.service";
import {EventMessageService} from "src/app/services/event-message.service";
import {AttachmentServiceService} from "src/app/services/attachment-service.service";
import { ServiceSpecServiceService } from 'src/app/services/service-spec-service.service';
import { ResourceSpecServiceService } from 'src/app/services/resource-spec-service.service';
import { PaginationService } from 'src/app/services/pagination.service';
import { LoginInfo } from 'src/app/models/interfaces';
import { initFlowbite } from 'flowbite';
import { FormGroup, FormControl, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { NgxFileDropEntry, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';
import { certifications } from 'src/app/models/certification-standards.const'
import * as moment from 'moment';
import { v4 as uuidv4 } from 'uuid';
import { noWhitespaceValidator } from 'src/app/validators/validators';

type CharacteristicValueSpecification = components["schemas"]["CharacteristicValueSpecification"];
type ProductSpecification_Create = components["schemas"]["ProductSpecification_Create"];
type BundledProductSpecification = components["schemas"]["BundledProductSpecification"];
type ProductSpecificationCharacteristic = components["schemas"]["ProductSpecificationCharacteristic"];
type ServiceSpecificationRef = components["schemas"]["ServiceSpecificationRef"];
type ResourceSpecificationRef = components["schemas"]["ResourceSpecificationRef"];
type ProductSpecificationRelationship = components["schemas"]["ProductSpecificationRelationship"];
type AttachmentRefOrValue = components["schemas"]["AttachmentRefOrValue"];

@Component({
  selector: 'create-product-spec',
  templateUrl: './create-product-spec.component.html',
  styleUrl: './create-product-spec.component.css'
})
export class CreateProductSpecComponent implements OnInit {

  //PAGE SIZES:
  PROD_SPEC_LIMIT: number = environment.PROD_SPEC_LIMIT;
  SERV_SPEC_LIMIT: number = environment.SERV_SPEC_LIMIT;
  RES_SPEC_LIMIT: number = environment.RES_SPEC_LIMIT;
  BUNDLE_ENABLED: boolean= environment.BUNDLE_ENABLED;
  MAX_FILE_SIZE: number=environment.MAX_FILE_SIZE;

  //CONTROL VARIABLES:
  showGeneral:boolean=true;
  showBundle:boolean=false;
  showCompliance:boolean=false;
  showChars:boolean=false;
  showResource:boolean=false;
  showService:boolean=false;
  showAttach:boolean=false;
  showRelationships:boolean=false;
  showSummary:boolean=false;

  //Check if step was done
  generalDone:boolean=false;
  bundleDone:boolean=false;
  complianceDone:boolean=false;
  charsDone:boolean=false;
  resourceDone:boolean=false;
  serviceDone:boolean=false;
  attachDone:boolean=false;
  relationshipDone:boolean=false;
  finishDone:boolean=false;

  stepsElements:string[]=['general-info','bundle','compliance','chars','resource','service','attach','relationships','summary'];
  stepsCircles:string[]=['general-circle','bundle-circle','compliance-circle','chars-circle','resource-circle','service-circle','attach-circle','relationships-circle','summary-circle'];

  showPreview:boolean=false;
  showEmoji:boolean=false;
  description:string='';  
  partyId:any='';

  //PRODUCT GENERAL INFO:
  generalForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.maxLength(100), noWhitespaceValidator]),
    brand: new FormControl('', [Validators.required, noWhitespaceValidator]),
    version: new FormControl('0.1', [Validators.required,Validators.pattern('^-?[0-9]\\d*(\\.\\d*)?$'), noWhitespaceValidator]),
    number: new FormControl(''),
    description: new FormControl('', Validators.maxLength(100000)),
  });

  //CHARS INFO
  charsForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.maxLength(100), noWhitespaceValidator]),
    description: new FormControl('')
  });
  stringCharSelected:boolean=true;
  numberCharSelected:boolean=false;
  rangeCharSelected:boolean=false;
  credentialsConfigSelected:boolean=false;
  policyConfigSelected:boolean=false;
  prodChars:ProductSpecificationCharacteristic[]=[];
  finishChars:ProductSpecificationCharacteristic[]=[];
  creatingChars:CharacteristicValueSpecification[]=[];
  showCreateChar:boolean=false;

  //BUNDLE INFO:
  bundleChecked:boolean=false;
  bundlePage=0;
  bundlePageCheck:boolean=false;
  loadingBundle:boolean=false;
  loadingBundle_more:boolean=false;
  prodSpecs:any[]=[];
  nextProdSpecs:any[]=[];
  //final selected products inside bundle
  prodSpecsBundle:BundledProductSpecification[]=[];

  //COMPLIANCE PROFILE INFO:
  buttonISOClicked:boolean=false;
  availableISOS:any[]=[];
  selectedISOS:any[]=[];
  selectedISO:any;
  showUploadFile:boolean=false;
  disableCompNext:boolean=true;
  selfAtt:any;
  showUploadAtt:boolean=false;

  //SERVICE INFO:
  serviceSpecPage=0;
  serviceSpecPageCheck:boolean=false;
  loadingServiceSpec:boolean=false;
  loadingServiceSpec_more:boolean=false;
  serviceSpecs:any[]=[];
  nextServiceSpecs:any[]=[];
  selectedServiceSpecs:ServiceSpecificationRef[]=[];

  //RESOURCE INFO:
  resourceSpecPage=0;
  resourceSpecPageCheck:boolean=false;
  loadingResourceSpec:boolean=false;
  loadingResourceSpec_more:boolean=false;
  resourceSpecs:any[]=[];
  nextResourceSpecs:any[]=[];
  selectedResourceSpecs:ResourceSpecificationRef[]=[];

  //RELATIONSHIPS INFO:
  prodRelationships:any[]=[];
  relToCreate:any;
  showCreateRel:boolean=false;
  prodSpecRelPage=0;
  prodSpecRelPageCheck:boolean=false;
  loadingprodSpecRel:boolean=false;
  loadingprodSpecRel_more:boolean=false;
  prodSpecRels:any[]=[];
  nextProdSpecRels:any[]=[];
  selectedProdSpec:any={id:''};
  selectedRelType:any='migration';

  //ATTACHMENT INFO
  showImgPreview:boolean=false;
  showNewAtt:boolean=false;
  imgPreview:any='';
  prodAttachments:AttachmentRefOrValue[]=[];
  attachToCreate:AttachmentRefOrValue={url:'',attachmentType:''};
  attFileName = new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z0-9 _.-]*')]);
  attImageName = new FormControl('', [Validators.required, Validators.pattern('^https?:\\/\\/.*\\.(?:png|jpg|jpeg|gif|bmp|webp)$')])

  //FINAL PRODUCT USING API CALL STRUCTURE
  productSpecToCreate:ProductSpecification_Create | undefined;

  errorMessage:any='';
  showError:boolean=false;
  loading:boolean=false;

  //CHARS
  stringValue: string = '';
  numberValue: string = '';
  numberUnit: string = '';
  fromValue: string = '';
  toValue: string = '';
  rangeUnit: string = '';
  jsonValue: string = '';

  filenameRegex = /^[A-Za-z0-9_.-]+$/;

  constructor(
    private router: Router,
    private api: ApiServiceService,
    private prodSpecService: ProductSpecServiceService,
    private cdr: ChangeDetectorRef,
    private localStorage: LocalStorageService,
    private eventMessage: EventMessageService,
    private elementRef: ElementRef,
    private attachmentService: AttachmentServiceService,
    private servSpecService: ServiceSpecServiceService,
    private resSpecService: ResourceSpecServiceService,
    private paginationService: PaginationService
  ) {
    for(let i=0; i<certifications.length; i++){
      this.availableISOS.push(certifications[i])
    }
    this.eventMessage.messages$.subscribe(ev => {
      if(ev.type === 'ChangedSession') {
        this.initPartyInfo();
      }
    })
  }

  @HostListener('document:click')
  onClick() {
    if(this.showEmoji==true){
      this.showEmoji=false;
      this.cdr.detectChanges();
    }
    if(this.showUploadFile==true){
      this.showUploadFile=false;
      this.cdr.detectChanges();
    }
  }

  @ViewChild('attachName') attachName!: ElementRef;
  @ViewChild('imgURL') imgURL!: ElementRef;
  

  public files: NgxFileDropEntry[] = [];

  ngOnInit() {
    this.initPartyInfo();
  }

  initPartyInfo(){
    let aux = this.localStorage.getObject('login_items') as LoginInfo;
    if(JSON.stringify(aux) != '{}' && (((aux.expire - moment().unix())-4) > 0)) {
      if(aux.logged_as==aux.id){
        this.partyId = aux.partyId;
      } else {
        let loggedOrg = aux.organizations.find((element: { id: any; }) => element.id == aux.logged_as)
        this.partyId = loggedOrg.partyId
      }
    }
  }

  goBack() {
    this.eventMessage.emitSellerProductSpec(true);
  }

  togglePreview(){
    if(this.generalForm.value.description){
      this.description=this.generalForm.value.description;
    } else {
      this.description=''
    }
  }

  toggleGeneral(){
    this.selectStep('general-info','general-circle');
    this.showBundle=false;
    this.showGeneral=true;
    this.showCompliance=false;
    this.showChars=false;
    this.showResource=false;
    this.showService=false;
    this.showAttach=false;
    this.showRelationships=false;
    this.showSummary=false;
    this.showPreview=false;
    this.refreshChars();
  }

  toggleBundle(){
    this.selectStep('bundle','bundle-circle');
    this.showBundle=true;
    this.showGeneral=false;
    this.showCompliance=false;
    this.showChars=false;
    this.showResource=false;
    this.showService=false;
    this.showAttach=false;
    this.showRelationships=false;
    this.showSummary=false;
    this.showPreview=false;
    this.refreshChars();
  }

  toggleBundleCheck(){
    this.prodSpecs=[];
    this.bundlePage=0;
    this.bundleChecked=!this.bundleChecked;
    if(this.bundleChecked==true){
      this.loadingBundle=true;
      this.getProdSpecs(false);
    } else {
      this.prodSpecsBundle=[];
    }
  }

  async getProdSpecs(next:boolean){
    if(next==false){
      this.loadingBundle=true;
    }
    
    let options = {
      "filters": ['Active','Launched'],
      "partyId": this.partyId,
      //"sort": undefined,
      //"isBundle": false
    }

    this.paginationService.getItemsPaginated(this.bundlePage, this.PROD_SPEC_LIMIT, next, this.prodSpecs,this.nextProdSpecs, options,
      this.prodSpecService.getProdSpecByUser.bind(this.prodSpecService)).then(data => {
      this.bundlePageCheck=data.page_check;      
      this.prodSpecs=data.items;
      this.nextProdSpecs=data.nextItems;
      this.bundlePage=data.page;
      this.loadingBundle=false;
      this.loadingBundle_more=false;
    })
  }

  async nextBundle(){
    await this.getProdSpecs(true);
  }

  addProdToBundle(prod:any){
    const index = this.prodSpecsBundle.findIndex(item => item.id === prod.id);
    if (index !== -1) {
      console.log('eliminar')
      this.prodSpecsBundle.splice(index, 1);
    } else {
      console.log('añadir')
      this.prodSpecsBundle.push({
        id: prod.id,
        href: prod.href,
        lifecycleStatus: prod.lifecycleStatus,
        name: prod.name
      });
    }    
    this.cdr.detectChanges();
    console.log(this.prodSpecsBundle)
  }

  isProdInBundle(prod:any){
    const index = this.prodSpecsBundle.findIndex(item => item.id === prod.id);
    if (index !== -1) {
      return true
    } else {
      return false;
    } 
  }

  toggleCompliance(){
    this.selectStep('compliance','compliance-circle');
    this.showBundle=false;
    this.showGeneral=false;
    this.showCompliance=true;
    this.showChars=false;
    this.showResource=false;
    this.showService=false;
    this.showAttach=false;
    this.showRelationships=false;
    this.showSummary=false;
    this.showPreview=false;
    this.refreshChars();
  }

  addISO(iso:any){
    const index = this.availableISOS.findIndex(item => item.name === iso.name);
    if (index !== -1) {
      console.log('seleccionar')
      this.availableISOS.splice(index, 1);
      this.selectedISOS.push({name: iso.name, url: '', mandatory: iso.mandatory, domesupported: iso.domesupported});
    }
    this.buttonISOClicked=!this.buttonISOClicked;
    this.cdr.detectChanges();
    console.log(this.availableISOS)
    console.log(this.selectedISOS)
  }

  removeISO(iso:any){
    const index = this.selectedISOS.findIndex(item => item.name === iso.name);
    if (index !== -1) {
      console.log('seleccionar')
      this.selectedISOS.splice(index, 1);
      this.availableISOS.push({name: iso.name, mandatory: iso.mandatory, domesupported: iso.domesupported});
    }  
    this.cdr.detectChanges(); 
  }

  removeSelfAtt(){
    console.log('remove self att')
    console.log(this.selfAtt)
    const index = this.finishChars.findIndex(item => item.name === this.selfAtt.name);
    console.log(index)
    if (index !== -1) {
      console.log('seleccionar')
      this.finishChars.splice(index, 1);
    }
    this.selfAtt='';
    this.cdr.detectChanges();
    console.log(this.finishChars)
  }

  checkValidISOS():boolean{
    let invalid = this.selectedISOS.find((p => {
      return p.url === ''
    }));
    if(invalid){
      return true;
    } else {
      return false;
    }
    
  }

  public dropped(files: NgxFileDropEntry[],sel:any) {
    this.files = files;
    for (const droppedFile of files) {
 
      // Is it a file?
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
          console.log('dropped')       

          if (file) {
            const reader = new FileReader();
            reader.onload = (e: any) => {
              const base64String: string = e.target.result.split(',')[1];
              console.log('BASE 64....')
              console.log(base64String); // You can use this base64 string as needed
              let prod_name='';
              if(this.generalForm.value.name!=null){
                prod_name=this.generalForm.value.name.replaceAll(/\s/g,'')+'_';
              }
              let fileBody = {
                content: {
                  name: prod_name+file.name,
                  data: base64String
                },
                contentType: file.type,
                isPublic: true
              }
              if(!this.isValidFilename(fileBody.content.name)){
                this.errorMessage='File names can only include alphabetical characters (A-Z, a-z) and a limited set of symbols, such as underscores (_), hyphens (-), and periods (.)';
                console.error('There was an error while uploading file!');
                this.showError=true;
                setTimeout(() => {
                  this.showError = false;
                }, 3000);
                return;
              }
              //IF FILES ARE HIGHER THAN 3MB THROW AN ERROR
              if(file.size>this.MAX_FILE_SIZE){
                this.errorMessage='File size must be under 3MB.';
                console.error('There was an error while uploading file!');
                this.showError=true;
                setTimeout(() => {
                  this.showError = false;
                }, 3000);
                return;
              }
              if(this.showCompliance && !this.showUploadAtt){
                const index = this.selectedISOS.findIndex(item => item.name === sel.name);
                this.attachmentService.uploadFile(fileBody).subscribe({
                  next: data => {
                      console.log(data)
                      this.selectedISOS[index].url=data.content;
                      //this.selectedISOS[index].attachmentType=file.type;
                      this.showUploadFile=false;
                      this.cdr.detectChanges();
                      console.log('uploaded')
                  },
                  error: error => {
                      console.error('There was an error while uploading the file!', error);
                      if(error.error.error){
                        console.log(error)
                        this.errorMessage='Error: '+error.error.error;
                      } else {
                        this.errorMessage='There was an error while uploading the file!';
                      }
                      if (error.status === 413) {
                        this.errorMessage='File size too large! Must be under 3MB.';
                      }
                      this.showError=true;
                      setTimeout(() => {
                        this.showError = false;
                      }, 3000);
                  }
                });
              }
              if(this.showUploadAtt){
                const index = this.finishChars.findIndex(item => item.name === this.selfAtt.name);
                this.attachmentService.uploadFile(fileBody).subscribe({
                  next: data => {
                      console.log(data)
                      if (index !== -1) {
                        this.selfAtt.productSpecCharacteristicValue=[{
                          isDefault: true,
                          value: data.content
                        }];
                        this.finishChars[index] = this.selfAtt;
                      } else {
                        this.selfAtt = {
                          id: 'urn:ngsi-ld:characteristic:'+uuidv4(),
                          name: 'Compliance:SelfAtt',
                          productSpecCharacteristicValue: [{
                            isDefault: true,
                            value: data.content
                          }]
                        }
                        this.finishChars.push(this.selfAtt)
                      }
                      this.showUploadFile=false;
                      this.showUploadAtt=false;
                      this.cdr.detectChanges();
                      console.log('uploaded')
                  },
                  error: error => {
                      console.error('There was an error while uploading the file!', error);
                      if(error.error.error){
                        console.log(error)
                        this.errorMessage='Error: '+error.error.error;
                      } else {
                        this.errorMessage='There was an error while uploading the file!';
                      }
                      if (error.status === 413) {
                        this.errorMessage='File size too large! Must be under 3MB.';
                      }
                      this.showError=true;
                      setTimeout(() => {
                        this.showError = false;
                      }, 3000);
                  }
                });
              }
              if(this.showAttach){
                console.log(file)
                this.attachmentService.uploadFile(fileBody).subscribe({
                  next: data => {
                      console.log(data)
                      if(sel=='img'){
                        if(file.type.startsWith("image")){
                          this.showImgPreview=true;
                          this.imgPreview=data.content;
                          this.prodAttachments.push({
                            name: 'Profile Picture',
                            url: this.imgPreview,
                            attachmentType: file.type
                          })
                        } else {
                          this.errorMessage='File must have a valid image format!';
                          this.showError=true;
                          setTimeout(() => {
                            this.showError = false;
                          }, 3000);
                        }
                      } else {
                        this.attachToCreate={url:data.content,attachmentType:file.type};
                      }

                      this.cdr.detectChanges();
                      console.log('uploaded')
                  },
                  error: error => {
                      console.error('There was an error while uploading!', error);
                      if(error.error.error){
                        console.log(error)
                        this.errorMessage='Error: '+error.error.error;
                      } else {
                        this.errorMessage='There was an error while uploading the file!';
                      }
                      if (error.status === 413) {
                        this.errorMessage='File size too large! Must be under 3MB.';
                      }
                      this.showError=true;
                      setTimeout(() => {
                        this.showError = false;
                      }, 3000);
                  }
                });
              }
            };
            reader.readAsDataURL(file);
          }
 
        });
      } else {
        // It was a directory (empty directories are added, otherwise only files)
        const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
        console.log(droppedFile.relativePath, fileEntry);
      }
    }
  }

  isValidFilename(filename: string): boolean {
    return this.filenameRegex.test(filename);
  }
 
  public fileOver(event: any){
    console.log(event);
  }
 
  public fileLeave(event: any){
    console.log('leave')
    console.log(event);
  }

  toggleUploadSelfAtt(){
    this.showUploadFile=true;
    this.showUploadAtt=true;
  }

  toggleUploadFile(sel:any){
    this.showUploadFile=true;
    this.selectedISO=sel;    
  }

  uploadFile(){
    console.log('uploading...')
  }

  toggleChars(){
    this.selectStep('chars','chars-circle');
    this.showBundle=false;
    this.showGeneral=false;
    this.showCompliance=false;
    this.showChars=true;
    this.showResource=false;
    this.showService=false;
    this.showAttach=false;
    this.showRelationships=false;
    this.showSummary=false;

    this.showCreateChar=false;
    this.stringCharSelected=true;
    this.numberCharSelected=false;
    this.rangeCharSelected=false;
    this.credentialsConfigSelected=false;
    this.policyConfigSelected=false;
    this.showPreview=false;
    this.refreshChars();
  }

  toggleResource(){
    this.loadingResourceSpec=true;
    this.resourceSpecs=[];
    this.resourceSpecPage=0;
    this.getResSpecs(false);
    this.selectStep('resource','resource-circle');
    this.showBundle=false;
    this.showGeneral=false;
    this.showCompliance=false;
    this.showChars=false;
    this.showResource=true;
    this.showService=false;
    this.showAttach=false;
    this.showRelationships=false;
    this.showSummary=false;
    this.showPreview=false;
    this.refreshChars();
  }

  async getResSpecs(next:boolean){
    if(next==false){
      this.loadingResourceSpec=true;
    }
    
    let options = {
      "filters": ['Active','Launched'],
      "partyId": this.partyId,
      //"sort": undefined,
      //"isBundle": false
    }

    this.paginationService.getItemsPaginated(this.resourceSpecPage, this.RES_SPEC_LIMIT, next, this.resourceSpecs,this.nextResourceSpecs, options,
      this.resSpecService.getResourceSpecByUser.bind(this.resSpecService)).then(data => {
      this.resourceSpecPageCheck=data.page_check;      
      this.resourceSpecs=data.items;
      this.nextResourceSpecs=data.nextItems;
      this.resourceSpecPage=data.page;
      this.loadingResourceSpec=false;
      this.loadingResourceSpec_more=false;
    })
  }

  async nextRes(){
    await this.getResSpecs(true);
  }

  addResToSelected(res:any){
    const index = this.selectedResourceSpecs.findIndex(item => item.id === res.id);
    if (index !== -1) {
      console.log('eliminar')
      this.selectedResourceSpecs.splice(index, 1);
    } else {
      console.log('añadir')
      this.selectedResourceSpecs.push({
        id: res.id,
        href: res.href,
        name: res.name
      });
    }    
    this.cdr.detectChanges();
    console.log(this.selectedResourceSpecs)
  }

  isResSelected(res:any){
    const index = this.selectedResourceSpecs.findIndex(item => item.id === res.id);
    if (index !== -1) {
      return true
    } else {
      return false;
    } 
  }

  toggleService(){
    this.loadingServiceSpec=true;
    this.serviceSpecs=[];
    this.serviceSpecPage=0;
    this.getServSpecs(false);
    this.selectStep('service','service-circle');
    this.showBundle=false;
    this.showGeneral=false;
    this.showCompliance=false;
    this.showChars=false;
    this.showResource=false;
    this.showService=true;
    this.showAttach=false;
    this.showRelationships=false;
    this.showSummary=false;
    this.showPreview=false;
    this.refreshChars();
  }

  async getServSpecs(next:boolean){
    if(next==false){
      this.loadingServiceSpec=true;
    }
    
    let options = {
      "filters": ['Active','Launched'],
      "partyId": this.partyId,
      //"sort": undefined,
      //"isBundle": false
    }

    this.paginationService.getItemsPaginated(this.serviceSpecPage, this.SERV_SPEC_LIMIT, next, this.serviceSpecs,this.nextServiceSpecs, options,
      this.servSpecService.getServiceSpecByUser.bind(this.servSpecService)).then(data => {
      this.serviceSpecPageCheck=data.page_check;      
      this.serviceSpecs=data.items;
      this.nextServiceSpecs=data.nextItems;
      this.serviceSpecPage=data.page;
      this.loadingServiceSpec=false;
      this.loadingServiceSpec_more=false;
    })
  }

  async nextServ(){
    await this.getServSpecs(true);
  }

  addServToSelected(serv:any){
    const index = this.selectedServiceSpecs.findIndex(item => item.id === serv.id);
    if (index !== -1) {
      console.log('eliminar')
      this.selectedServiceSpecs.splice(index, 1);
    } else {
      console.log('añadir')
      this.selectedServiceSpecs.push({
        id: serv.id,
        href: serv.href,
        name: serv.name
      });
    }    
    this.cdr.detectChanges();
    console.log(this.selectedServiceSpecs)
  }

  isServSelected(serv:any){
    const index = this.selectedServiceSpecs.findIndex(item => item.id === serv.id);
    if (index !== -1) {
      return true
    } else {
      return false;
    } 
  }

  toggleAttach(){
    this.selectStep('attach','attach-circle');
    this.showBundle=false;
    this.showGeneral=false;
    this.showCompliance=false;
    this.showChars=false;
    this.showResource=false;
    this.showService=false;
    this.showAttach=true;
    this.showRelationships=false;
    this.showSummary=false;
    this.showPreview=false;
    setTimeout(() => {        
      initFlowbite();   
    }, 100);
    this.refreshChars();
  }

  removeImg(){    
    this.showImgPreview=false;
    const index = this.prodAttachments.findIndex(item => item.url === this.imgPreview);
    if (index !== -1) {
      console.log('eliminar')
      this.prodAttachments.splice(index, 1);
    }
    this.imgPreview='';
    this.cdr.detectChanges();
  }

  saveImgFromURL(){
    this.showImgPreview=true;
    this.imgPreview=this.imgURL.nativeElement.value;
    this.prodAttachments.push({
      name: 'Profile Picture',
      url: this.imgPreview,
      attachmentType: 'Picture'
    })
    this.attImageName.reset();
    this.cdr.detectChanges();
  }

  removeAtt(att:any){
    const index = this.prodAttachments.findIndex(item => item.url === att.url);
    if (index !== -1) {
      console.log('eliminar')
      if(this.prodAttachments[index].name=='Profile Picture'){
        this.showImgPreview=false;
        this.imgPreview='';
        this.cdr.detectChanges();
      }
      this.prodAttachments.splice(index, 1);
    }  
    this.cdr.detectChanges();
  }

  saveAtt(){
    console.log('saving')
    this.prodAttachments.push({
      name: this.attachName.nativeElement.value,
      url: this.attachToCreate.url,
      attachmentType: this.attachToCreate.attachmentType
    })
    this.attachName.nativeElement.value='';
    this.attachToCreate={url:'',attachmentType:''};
    this.showNewAtt=false;
    this.attFileName.reset();
  }

  clearAtt(){
    this.attachToCreate={url:'',attachmentType:''};
  }

  toggleRelationship(){
    this.prodSpecRels=[];
    this.prodSpecRelPage=0;
    this.showCreateRel=false;
    this.loadingprodSpecRel=true;
    this.getProdSpecsRel(false);
    this.selectStep('relationships','relationships-circle');
    this.showBundle=false;
    this.showGeneral=false;
    this.showCompliance=false;
    this.showChars=false;
    this.showResource=false;
    this.showService=false;
    this.showAttach=false;
    this.showRelationships=true;
    this.showSummary=false;
    this.showPreview=false;
    this.refreshChars();
  }

  async getProdSpecsRel(next:boolean){
    if(next==false){
      this.loadingprodSpecRel=true;
    }
    
    let options = {
      "filters": ['Active','Launched'],
      "partyId": this.partyId,
      //"sort": undefined,
      //"isBundle": false
    }

    this.paginationService.getItemsPaginated(this.prodSpecRelPage, this.PROD_SPEC_LIMIT, next, this.prodSpecRels, this.nextProdSpecRels, options,
      this.prodSpecService.getProdSpecByUser.bind(this.prodSpecService)).then(data => {
      this.prodSpecRelPageCheck=data.page_check;      
      this.prodSpecRels=data.items;
      this.nextProdSpecRels=data.nextItems;
      this.prodSpecRelPage=data.page;
      this.loadingprodSpecRel=false;
      this.loadingprodSpecRel_more=false;
    })
  }

  selectRelationship(rel:any){
    this.selectedProdSpec=rel;
  }

  async nextProdSpecsRel(){
    await this.getProdSpecsRel(true);
  }

  onRelChange(event: any) {
    console.log('relation type changed')
    this.selectedRelType=event.target.value
  }

  saveRel(){
    this.showCreateRel=false;
    this.prodRelationships.push({
      id: this.selectedProdSpec.id,
      href: this.selectedProdSpec.href,
      relationshipType: this.selectedRelType,
      productSpec: this.selectedProdSpec
    });
    this.selectedRelType='migration';
    console.log(this.prodRelationships)
  }

  deleteRel(rel:any){
    const index = this.prodRelationships.findIndex(item => item.id === rel.id);
    if (index !== -1) {
      console.log('eliminar')
      this.prodRelationships.splice(index, 1);
    }   
    this.cdr.detectChanges(); 
  }

  refreshChars(){
    this.stringValue= '';
    this.numberValue = '';
    this.numberUnit = '';
    this.fromValue = '';
    this.toValue = '';
    this.rangeUnit = '';
    this.jsonValue = '';
    this.stringCharSelected=true;
    this.numberCharSelected=false;
    this.rangeCharSelected=false;
    this.credentialsConfigSelected=false;
    this.policyConfigSelected=false;
    this.creatingChars=[];
  }

  removeClass(elem: HTMLElement, cls:string) {
    var str = " " + elem.className + " ";
    elem.className = str.replace(" " + cls + " ", " ").replace(/^\s+|\s+$/g, "");
  }

  addClass(elem: HTMLElement, cls:string) {
      elem.className += (" " + cls);
  }

  unselectMenu(elem:HTMLElement | null,cls:string){
    if(elem != null){
      if(elem.className.match(cls)){
        this.removeClass(elem,cls)
      } else {
        console.log('already unselected')
      }
    }
  }

  selectMenu(elem:HTMLElement| null,cls:string){
    if(elem != null){
      if(elem.className.match(cls)){
        console.log('already selected')
      } else {
        this.addClass(elem,cls)
      }
    }
  }

  //STEPS CSS EFFECTS:
  selectStep(step:string,stepCircle:string){
    const index = this.stepsElements.findIndex(item => item === step);
    if (index !== -1) {
      this.stepsElements.splice(index, 1);
      this.selectMenu(document.getElementById(step),'text-primary-100 dark:text-primary-50')
      this.unselectMenu(document.getElementById(step),'text-gray-500') 
      for(let i=0; i<this.stepsElements.length;i++){
        this.unselectMenu(document.getElementById(this.stepsElements[i]),'text-primary-100 dark:text-primary-50')
        this.selectMenu(document.getElementById(this.stepsElements[i]),'text-gray-500') 
      }
      this.stepsElements.push(step);
    }
    const circleIndex = this.stepsCircles.findIndex(item => item === stepCircle);
    if (index !== -1) {
      this.stepsCircles.splice(circleIndex, 1);
      this.selectMenu(document.getElementById(stepCircle),'border-primary-100 dark:border-primary-50')
      this.unselectMenu(document.getElementById(stepCircle),'border-gray-400');
      for(let i=0; i<this.stepsCircles.length;i++){
        this.unselectMenu(document.getElementById(this.stepsCircles[i]),'border-primary-100 dark:border-primary-50')
        this.selectMenu(document.getElementById(this.stepsCircles[i]),'border-gray-400');
      }
      this.stepsCircles.push(stepCircle);
    }
  }

  onTypeChange(event: any) {
    if(event.target.value=='string'){
      this.stringCharSelected=true;
      this.numberCharSelected=false;
      this.rangeCharSelected=false;
      this.credentialsConfigSelected=false;
      this.policyConfigSelected=false;
    }else if (event.target.value=='number'){
      this.stringCharSelected=false;
      this.numberCharSelected=true;
      this.rangeCharSelected=false;
      this.credentialsConfigSelected=false;
      this.policyConfigSelected=false;
    }else if(event.target.value=='range'){
      this.stringCharSelected=false;
      this.numberCharSelected=false;
      this.rangeCharSelected=true;
      this.credentialsConfigSelected=false;
      this.policyConfigSelected=false;
    }else if(event.target.value=='credentialsConfiguration'){
      this.stringCharSelected=false;
      this.numberCharSelected=false;
      this.rangeCharSelected=false;
      this.credentialsConfigSelected=true;
      this.policyConfigSelected=false;
    }else if(event.target.value=='authorizationPolicy'){
      this.stringCharSelected=false;
      this.numberCharSelected=false;
      this.rangeCharSelected=false;
      this.credentialsConfigSelected=false;
      this.policyConfigSelected=true;
    }
    this.creatingChars=[];
  }

  addCharValue(){
    if(this.stringCharSelected){
      console.log('string')
      if(this.creatingChars.length==0){
        this.creatingChars.push({
          isDefault:true,
          value:this.stringValue as any
        })
      } else{
        this.creatingChars.push({
          isDefault:false,
          value:this.stringValue as any
        })
      }
      this.stringValue='';
    } else if (this.numberCharSelected){
      console.log('number')
      if(this.creatingChars.length==0){
        this.creatingChars.push({
          isDefault:true,
          value:this.numberValue as any,
          unitOfMeasure:this.numberUnit
        })
      } else{
        this.creatingChars.push({
          isDefault:false,
          value:this.numberValue as any,
          unitOfMeasure:this.numberUnit
        })
      }
      this.numberUnit='';
      this.numberValue='';
    }else if(this.rangeCharSelected){
      console.log('range')
      if(this.creatingChars.length==0){
        this.creatingChars.push({
          isDefault:true,
          valueFrom:this.fromValue as any,
          valueTo:this.toValue as any,
          unitOfMeasure:this.rangeUnit
        })
      } else{
        this.creatingChars.push({
          isDefault:false,
          valueFrom:this.fromValue as any,
          valueTo:this.toValue as any,
          unitOfMeasure:this.rangeUnit})
      }
      this.fromValue='';
      this.toValue='';
      this.rangeUnit='';
    }else if(this.credentialsConfigSelected || this.policyConfigSelected){
      console.log('json')
      try {
        const jsonObj = JSON.parse(this.jsonValue);
        if(this.creatingChars.length==0){
          this.creatingChars.push({
            isDefault:true,
            value:jsonObj as any
          })
        } else{
          this.creatingChars.push({
            isDefault:false,
            value:jsonObj as any
          })
        }
        this.jsonValue='';
      } catch (e) {
        this.errorMessage='Invalid JSON format';
        this.showError=true;
        setTimeout(() => {
          this.showError = false;
        }, 3000);
      }
    }
  }

  removeCharValue(char:any,idx:any){
    console.log(this.creatingChars)
    this.creatingChars.splice(idx, 1);
    console.log(this.creatingChars)
  }

  selectDefaultChar(char:any,idx:any){
    for(let i=0;i<this.creatingChars.length;i++){
      if(i==idx){
        this.creatingChars[i].isDefault=true;
      } else {
        this.creatingChars[i].isDefault=false;
      }
    }
  }

  saveChar(){
    if(this.charsForm.value.name!=null){
      let characteristic: any = {
        id: 'urn:ngsi-ld:characteristic:'+uuidv4(),
        name: this.charsForm.value.name,
        description: this.charsForm.value.description != null ? this.charsForm.value.description : '',
        productSpecCharacteristicValue: this.creatingChars
      };

      if(this.credentialsConfigSelected){
        characteristic.valueType = 'credentialsConfiguration';
        characteristic['@schemaLocation'] = 'https://raw.githubusercontent.com/FIWARE/contract-management/refs/heads/main/schemas/credentials/credentialConfigCharacteristic.json';
      } else if(this.policyConfigSelected){
        characteristic.valueType = 'authorizationPolicy';
        characteristic['@schemaLocation'] = 'https://raw.githubusercontent.com/FIWARE/contract-management/refs/heads/policy-support/schemas/odrl/policyCharacteristic.json';
      }

      this.prodChars.push(characteristic);
    }

    this.charsForm.reset();
    this.creatingChars=[];
    this.showCreateChar=false;
    this.stringCharSelected=true;
    this.numberCharSelected=false;
    this.rangeCharSelected=false;
    this.credentialsConfigSelected=false;
    this.policyConfigSelected=false;
    this.refreshChars();
    this.cdr.detectChanges();
  }

  deleteChar(char:any){
    const index = this.prodChars.findIndex(item => item.id === char.id);
    if (index !== -1) {
      console.log('eliminar')
      this.prodChars.splice(index, 1);
    }   
    this.cdr.detectChanges();
    console.log(this.prodChars)    
  }

  checkInput(value: string): boolean {
    return value.trim().length === 0;
  }

  showFinish(){
    this.relationshipDone=true;
    this.finishDone=true;
    for(let i=0; i< this.prodChars.length; i++){
      const index = this.finishChars.findIndex(item => item.name === this.prodChars[i].name);
      if (index == -1) {
        this.finishChars.push(this.prodChars[i])
      }
    }
    for(let i=0; i<this.selectedISOS.length;i++){
      const index = this.finishChars.findIndex(item => item.name === this.selectedISOS[i].name);
      if (index == -1) {
        this.finishChars.push({
          id: 'urn:ngsi-ld:characteristic:'+uuidv4(),
          name: this.selectedISOS[i].name,
          productSpecCharacteristicValue: [{
            isDefault: true,
            value: this.selectedISOS[i].url
          }]
        })
      }
    }
    let rels = [];
    for(let i=0; i<this.prodRelationships.length;i++){
      rels.push({
        id: this.prodRelationships[i].id,
        href: this.prodRelationships[i].href,
        name: this.prodRelationships[i].name,
        relationshipType: this.prodRelationships[i].relationshipType
      })
    }
    console.log('rels')
    console.log(rels)
    if(this.generalForm.value.name!=null && this.generalForm.value.version!=null && this.generalForm.value.brand!=null){
      this.productSpecToCreate={
        name: this.generalForm.value.name,
        description: this.generalForm.value.description != null ? this.generalForm.value.description : '',
        version: this.generalForm.value.version,
        brand: this.generalForm.value.brand,
        productNumber: this.generalForm.value.number != null ? this.generalForm.value.number : '',
        lifecycleStatus: "Active",
        isBundle: this.bundleChecked,
        bundledProductSpecification: this.prodSpecsBundle,
        productSpecCharacteristic: this.finishChars,
        productSpecificationRelationship: rels,
        attachment: this.prodAttachments,
        relatedParty: [
          {
              id: this.partyId,
              //href: "http://proxy.docker:8004/party/individual/urn:ngsi-ld:individual:803ee97b-1671-4526-ba3f-74681b22ccf3",
              role: "Owner",
              "@referredType": ''
          }
        ],
        resourceSpecification: this.selectedResourceSpecs,
        serviceSpecification: this.selectedServiceSpecs  
      }
    }
    console.log('PRODUCTO A CREAR:')
    console.log(this.productSpecToCreate)
    console.log(this.imgPreview)
    this.selectStep('summary','summary-circle');
    this.showBundle=false;
    this.showGeneral=false;
    this.showCompliance=false;
    this.showChars=false;
    this.showResource=false;
    this.showService=false;
    this.showAttach=false;
    this.showRelationships=false;
    this.showSummary=true;
    this.showPreview=false;
    this.refreshChars();
  }

  createProduct(){
    this.loading=true;
    this.prodSpecService.postProdSpec(this.productSpecToCreate).subscribe({
      next: data => {
        this.loading=false;
        this.goBack();
      },
      error: error => {
        console.error('There was an error while creating!', error);
        if(error.error.error){
          console.log(error)
          this.errorMessage='Error: '+error.error.error;
        } else {
          this.errorMessage='There was an error while creating the product!';
        }
        this.loading=false;
        this.showError=true;
        setTimeout(() => {
          this.showError = false;
        }, 3000);
      }
    });
  }

  //Markdown actions:
  addBold() {
    const currentText = this.generalForm.value.description;
    this.generalForm.patchValue({
      description: currentText + ' **bold text** '
    });
  }

  addItalic() {
    const currentText = this.generalForm.value.description;
    this.generalForm.patchValue({
      description: currentText + ' _italicized text_ '
    });
  }

  addList(){
    const currentText = this.generalForm.value.description;
    this.generalForm.patchValue({
      description: currentText + '\n- First item\n- Second item'
    });    
  }

  addOrderedList(){
    const currentText = this.generalForm.value.description;
    this.generalForm.patchValue({
      description: currentText + '\n1. First item\n2. Second item'
    });    
  }

  addCode(){
    const currentText = this.generalForm.value.description;
    this.generalForm.patchValue({
      description: currentText + '\n`code`'
    });    
  }

  addCodeBlock(){
    const currentText = this.generalForm.value.description;
    this.generalForm.patchValue({
      description: currentText + '\n```\ncode\n```'
    }); 
  }

  addBlockquote(){
    const currentText = this.generalForm.value.description;
    this.generalForm.patchValue({
      description: currentText + '\n> blockquote'
    });    
  }

  addLink(){
    const currentText = this.generalForm.value.description;
    this.generalForm.patchValue({
      description: currentText + ' [title](https://www.example.com) '
    });    
  } 

  addTable(){
    const currentText = this.generalForm.value.description;
    this.generalForm.patchValue({
      description: currentText + '\n| Syntax | Description |\n| ----------- | ----------- |\n| Header | Title |\n| Paragraph | Text |'
    });
  }

  addEmoji(event:any){
    console.log(event)
    this.showEmoji=false;
    const currentText = this.generalForm.value.description;
    this.generalForm.patchValue({
      description: currentText + event.emoji.native
    });
  }

}