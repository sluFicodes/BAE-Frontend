import { Component, OnInit, ChangeDetectorRef, HostListener, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {faIdCard, faSort, faSwatchbook, faSparkles} from "@fortawesome/pro-solid-svg-icons";
import {components} from "src/app/models/product-catalog";
type CharacteristicValueSpecification = components["schemas"]["CharacteristicValueSpecification"];
import { environment } from 'src/environments/environment';
import { ApiServiceService } from 'src/app/services/product-service.service';
import { ProductSpecServiceService } from 'src/app/services/product-spec-service.service';
import {LocalStorageService} from "src/app/services/local-storage.service";
import {EventMessageService} from "src/app/services/event-message.service";
import {AttachmentServiceService} from "src/app/services/attachment-service.service";
import { ServiceSpecServiceService } from 'src/app/services/service-spec-service.service';
import { ResourceSpecServiceService } from 'src/app/services/resource-spec-service.service';
import { LoginInfo } from 'src/app/models/interfaces';
import { initFlowbite } from 'flowbite';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgxFileDropEntry, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';
import * as moment from 'moment';

@Component({
  selector: 'create-product-spec',
  templateUrl: './create-product-spec.component.html',
  styleUrl: './create-product-spec.component.css'
})
export class CreateProductSpecComponent implements OnInit {

  generalForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    brand: new FormControl('', [Validators.required]),
    version: new FormControl('', [Validators.required]),
    number: new FormControl(''),
    description: new FormControl(''),
  });

  charsForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl('')
  });

  showGeneral:boolean=true;
  showBundle:boolean=false;
  showCompliance:boolean=false;
  showChars:boolean=false;
  showResource:boolean=false;
  showService:boolean=false;
  showAttach:boolean=false;
  showRelationships:boolean=false;

  showPreview:boolean=false;
  showEmoji:boolean=false;
  description:string='';  
  partyId:any='';

  PROD_SPEC_LIMIT: number = environment.PROD_SPEC_LIMIT;
  SERV_SPEC_LIMIT: number = environment.SERV_SPEC_LIMIT;
  RES_SPEC_LIMIT: number = environment.RES_SPEC_LIMIT;

  bundleChecked:boolean=false;
  bundlePage=0;
  bundlePageCheck:boolean=false;
  loadingBundle:boolean=false;
  loadingBundle_more:boolean=false;
  prodSpecs:any[]=[];
  prodSpecsBundle:any[]=[];

  buttonISOClicked:boolean=false;
  availableISOS:string[]=['EU Cloud Security','EU Cloud Rulebook','ISO 27001','ISO 27017','ISO 17025'];
  selectedISOS:any[]=[];
  selectedISO:any;
  showUploadFile:boolean=false;

  stepsElements:string[]=['general-info','bundle','compliance','chars','resource','service','attach','relationships'];
  stepsCircles:string[]=['general-circle','bundle-circle','compliance-circle','chars-circle','resource-circle','service-circle','attach-circle','relationships-circle'];

  stringCharSelected:boolean=true;
  numberCharSelected:boolean=false;
  rangeCharSelected:boolean=false;
  prodChars:any[]=[];
  creatingChars:CharacteristicValueSpecification[]=[];
  showCreateChar:boolean=false;

  serviceSpecPage=0;
  serviceSpecPageCheck:boolean=false;
  loadingServiceSpec:boolean=false;
  loadingServiceSpec_more:boolean=false;
  serviceSpecs:any[]=[];
  selectedServiceSpecs:any[]=[];

  resourceSpecPage=0;
  resourceSpecPageCheck:boolean=false;
  loadingResourceSpec:boolean=false;
  loadingResourceSpec_more:boolean=false;
  resourceSpecs:any[]=[];
  selectedResourceSpecs:any[]=[];

  prodRelationships:any[]=[];
  relToCreate:any;
  showCreateRel:boolean=false;
  prodSpecRelPage=0;
  prodSpecRelPageCheck:boolean=false;
  loadingprodSpecRel:boolean=false;
  loadingprodSpecRel_more:boolean=false;
  prodSpecRels:any[]=[];
  showImgPreview:boolean=false;
  showNewAtt:boolean=false;
  imgPreview:any;
  prodAttachments:any[]=[];
  attachToCreate:any='';

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
  ) {
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

  @ViewChild('stringValue') charStringValue!: ElementRef;
  @ViewChild('numberValue') charNumberValue!: ElementRef;
  @ViewChild('numberUnit') charNumberUnit!: ElementRef;
  @ViewChild('fromValue') charFromValue!: ElementRef;
  @ViewChild('toValue') charToValue!: ElementRef;
  @ViewChild('rangeUnit') charRangeUnit!: ElementRef;
  @ViewChild('attachName') attachName!: ElementRef;
  

  public files: NgxFileDropEntry[] = [];

  ngOnInit() {
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
  }

  toggleBundleCheck(){
    this.bundleChecked=!this.bundleChecked;
    if(this.bundleChecked==true){
      this.loadingBundle=true;
      this.getProdSpecs();
    } else {
      this.prodSpecs=[];
    }
  }

  getProdSpecs(){    
    this.prodSpecService.getProdSpecByUser(this.bundlePage,['Active','Launched'],this.partyId,undefined,false).then(data => {
      if(data.length<this.PROD_SPEC_LIMIT){
        this.bundlePageCheck=false;
        this.cdr.detectChanges();
      }else{
        this.bundlePageCheck=true;
        this.cdr.detectChanges();
      }
      for(let i=0; i < data.length; i++){
        this.prodSpecs.push(data[i])
      }
      this.loadingBundle=false;
      this.loadingBundle_more=false;
      console.log('--- prodSpecs')
      console.log(this.prodSpecs)
    })
  }

  async nextBundle(){
    this.loadingBundle_more=true;
    this.bundlePage=this.bundlePage+this.PROD_SPEC_LIMIT;
    this.cdr.detectChanges;
    console.log(this.bundlePage)
    await this.getProdSpecs();
  }

  addProdToBundle(prod:any){
    const index = this.prodSpecsBundle.findIndex(item => item.id === prod.id);
    if (index !== -1) {
      console.log('eliminar')
      this.prodSpecsBundle.splice(index, 1);
    } else {
      console.log('añadir')
      this.prodSpecsBundle.push(prod);
    }    
    this.cdr.detectChanges();
    console.log(this.prodSpecsBundle)
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
  }

  addISO(iso:string){
    const index = this.availableISOS.findIndex(item => item === iso);
    if (index !== -1) {
      console.log('seleccionar')
      this.availableISOS.splice(index, 1);
      this.selectedISOS.push({name: iso, value: ''});
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
      this.availableISOS.push(iso.name);
    }  
    this.cdr.detectChanges();
    console.log(this.prodSpecsBundle)    
  }

  addISOValue(sel:any){
    const index = this.selectedISOS.findIndex(item => item.name === sel.name);
    const nativeElement = document.getElementById('iso-'+sel.name);
    console.log(nativeElement)  
    console.log(this.selectedISOS)
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
              let fileBody = {
                content: {
                  name: file.name,
                  data: base64String
                },
                contentType: file.type,
                isPublic: true
              }
              if(this.showCompliance){
                const index = this.selectedISOS.findIndex(item => item.name === sel.name);
                this.attachmentService.uploadFile(fileBody).subscribe({
                  next: data => {
                      console.log(data)
                      this.selectedISOS[index].value=data.content;
                      this.showUploadFile=false;
                      this.cdr.detectChanges();
                      console.log('uploaded')
                  },
                  error: error => {
                      console.error('There was an error while updating!', error);
                  }
                });
              }
              if(this.showAttach){
                console.log(file)
                this.attachmentService.uploadFile(fileBody).subscribe({
                  next: data => {
                      console.log(data)
                      if(sel=='img'){
                        this.showImgPreview=true;
                        this.imgPreview=data.content;
                      } else {
                        this.attachToCreate=data.content;
                      }

                      this.cdr.detectChanges();
                      console.log('uploaded')
                  },
                  error: error => {
                      console.error('There was an error while updating!', error);
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
 
  public fileOver(event: any){
    console.log(event);
  }
 
  public fileLeave(event: any){
    console.log('leave')
    console.log(event);
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
  }

  toggleResource(){
    this.loadingResourceSpec=true;
    this.getResSpecs();
    this.selectStep('resource','resource-circle');
    this.showBundle=false;
    this.showGeneral=false;
    this.showCompliance=false;
    this.showChars=false;
    this.showResource=true;
    this.showService=false;
    this.showAttach=false;
    this.showRelationships=false;
  }

  getResSpecs(){    
    this.resSpecService.getResourceSpecByUser(this.resourceSpecPage,[],this.partyId,undefined).then(data => {
      if(data.length<this.RES_SPEC_LIMIT){
        this.resourceSpecPageCheck=false;
        this.cdr.detectChanges();
      }else{
        this.resourceSpecPageCheck=true;
        this.cdr.detectChanges();
      }
      for(let i=0; i < data.length; i++){
        this.resourceSpecs.push(data[i])
      }
      this.loadingResourceSpec=false;
      this.loadingResourceSpec_more=false;
      console.log('--- resourceSpecs')
      console.log(this.resourceSpecs)
    })
  }

  async nextRes(){
    this.loadingResourceSpec_more=true;
    this.resourceSpecPage=this.resourceSpecPage+this.RES_SPEC_LIMIT;
    this.cdr.detectChanges;
    console.log(this.resourceSpecPage)
    await this.getResSpecs();
  }

  addResToSelected(res:any){
    const index = this.selectedServiceSpecs.findIndex(item => item.id === res.id);
    if (index !== -1) {
      console.log('eliminar')
      this.selectedResourceSpecs.splice(index, 1);
    } else {
      console.log('añadir')
      this.selectedResourceSpecs.push(res);
    }    
    this.cdr.detectChanges();
    console.log(this.selectedResourceSpecs)
  }

  toggleService(){
    this.loadingServiceSpec=true;
    this.getServSpecs();
    this.selectStep('service','service-circle');
    this.showBundle=false;
    this.showGeneral=false;
    this.showCompliance=false;
    this.showChars=false;
    this.showResource=false;
    this.showService=true;
    this.showAttach=false;
    this.showRelationships=false;
  }

  getServSpecs(){    
    this.servSpecService.getServiceSpecByUser(this.serviceSpecPage,[],this.partyId,undefined).then(data => {
      if(data.length<this.SERV_SPEC_LIMIT){
        this.serviceSpecPageCheck=false;
        this.cdr.detectChanges();
      }else{
        this.serviceSpecPageCheck=true;
        this.cdr.detectChanges();
      }
      for(let i=0; i < data.length; i++){
        this.serviceSpecs.push(data[i])
      }
      this.loadingServiceSpec=false;
      this.loadingServiceSpec_more=false;
      console.log('--- servSpecs')
      console.log(this.serviceSpecs)
    })
  }

  async nextServ(){
    this.loadingServiceSpec_more=true;
    this.serviceSpecPage=this.serviceSpecPage+this.SERV_SPEC_LIMIT;
    this.cdr.detectChanges;
    console.log(this.serviceSpecPage)
    await this.getServSpecs();
  }

  addServToSelected(serv:any){
    const index = this.selectedServiceSpecs.findIndex(item => item.id === serv.id);
    if (index !== -1) {
      console.log('eliminar')
      this.selectedServiceSpecs.splice(index, 1);
    } else {
      console.log('añadir')
      this.selectedServiceSpecs.push(serv);
    }    
    this.cdr.detectChanges();
    console.log(this.selectedServiceSpecs)
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
  }

  removeImg(){    
    this.showImgPreview=false;
    this.imgPreview='';
    this.cdr.detectChanges();
  }

  removeAtt(att:any){
    const index = this.prodAttachments.findIndex(item => item.value === att.value);
    if (index !== -1) {
      console.log('eliminar')
      this.prodAttachments.splice(index, 1);
    }  
    this.cdr.detectChanges();
  }

  saveAtt(){
    console.log('saving')
    this.prodAttachments.push({
      name: this.attachName.nativeElement.value,
      value: this.attachToCreate
    })
    this.attachName.nativeElement.value='';
    this.attachToCreate='';
    this.showNewAtt=false;
  }

  clearAtt(){
    this.attachToCreate='';
  }

  toggleRelationship(){
    this.loadingprodSpecRel=true;
    this.getProdSpecsRel();
    this.selectStep('relationships','relationships-circle');
    this.showBundle=false;
    this.showGeneral=false;
    this.showCompliance=false;
    this.showChars=false;
    this.showResource=false;
    this.showService=false;
    this.showAttach=false;
    this.showRelationships=true;
  }

  getProdSpecsRel(){
    this.prodSpecService.getProdSpecByUser(this.prodSpecRelPage,['Active','Launched'],this.partyId,undefined,false).then(data => {
      if(data.length<this.PROD_SPEC_LIMIT){
        this.prodSpecRelPageCheck=false;
        this.cdr.detectChanges();
      }else{
        this.prodSpecRelPageCheck=true;
        this.cdr.detectChanges();
      }
      for(let i=0; i < data.length; i++){
        this.prodSpecRels.push(data[i])
      }
      this.loadingprodSpecRel=false;
      this.loadingprodSpecRel_more=false;
      console.log('--- prodSpecs')
      console.log(this.prodSpecRels)
    })
  }

  async nextProdSpecsRel(){
    this.loadingprodSpecRel_more=true;
    this.prodSpecRelPage=this.prodSpecRelPage+this.SERV_SPEC_LIMIT;
    this.cdr.detectChanges;
    console.log(this.prodSpecRelPage)
    await this.getProdSpecsRel();
  }

  onRelChange(event: any) {
    console.log('relation type changed')
  }

  saveRel(){
    this.showCreateRel=false;
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
      this.selectMenu(document.getElementById(step),'text-primary-100')
      for(let i=0; i<this.stepsElements.length;i++){
        this.unselectMenu(document.getElementById(this.stepsElements[i]),'text-primary-100')
      }
      this.stepsElements.push(step);
    }
    const circleIndex = this.stepsCircles.findIndex(item => item === stepCircle);
    if (index !== -1) {
      this.stepsCircles.splice(circleIndex, 1);
      this.selectMenu(document.getElementById(stepCircle),'border-primary-100')
      this.unselectMenu(document.getElementById(stepCircle),'border-gray-400');
      for(let i=0; i<this.stepsCircles.length;i++){
        this.unselectMenu(document.getElementById(this.stepsCircles[i]),'border-primary-100')
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
    }else if (event.target.value=='number'){
      this.stringCharSelected=false;
      this.numberCharSelected=true;
      this.rangeCharSelected=false;
    }else{
      this.stringCharSelected=false;
      this.numberCharSelected=false;
      this.rangeCharSelected=true;
    }
    this.creatingChars=[];
  }

  addCharValue(){
    if(this.stringCharSelected){
      console.log('string')
      if(this.creatingChars.length==0){
        this.creatingChars.push({isDefault:true,valueType:'string',value:this.charStringValue.nativeElement.value})
      } else{
        this.creatingChars.push({isDefault:false,valueType:'string',value:this.charStringValue.nativeElement.value})
      }      
    } else if (this.numberCharSelected){
      console.log('number')
      if(this.creatingChars.length==0){
        this.creatingChars.push({isDefault:true,valueType:'number',value:this.charNumberValue.nativeElement.value,unitOfMeasure:this.charNumberUnit.nativeElement.value})
      } else{
        this.creatingChars.push({isDefault:false,valueType:'number',value:this.charNumberValue.nativeElement.value,unitOfMeasure:this.charNumberUnit.nativeElement.value})
      } 
    }else{
      console.log('range')
      if(this.creatingChars.length==0){
        this.creatingChars.push({isDefault:true,valueType:'range',valueFrom:this.charFromValue.nativeElement.value,valueTo:this.charToValue.nativeElement.value,unitOfMeasure:this.charRangeUnit.nativeElement.value})
      } else{
        this.creatingChars.push({isDefault:false,valueType:'range',valueFrom:this.charFromValue.nativeElement.value,valueTo:this.charToValue.nativeElement.value,unitOfMeasure:this.charRangeUnit.nativeElement.value})
      } 
    }
  }

  saveChar(){
    this.prodChars.push({
      name: this.charsForm.value.name,
      description: this.charsForm.value.description,
      values: this.creatingChars
    })
    this.charsForm.reset();
    this.creatingChars=[];
    this.showCreateChar=false;
    this.cdr.detectChanges();
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
