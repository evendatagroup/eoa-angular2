import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PdfViewerModule } from 'ng2-pdf-viewer';
// delon
import { NgZorroAntdExtraModule } from 'ng-zorro-antd-extra';
import { AlainThemeModule } from '@delon/theme';
import { AlainACLModule } from '@delon/acl';
import { ZORROMODULES, ABCMODULES } from '../delon.module';
// i18n
import { TranslateModule } from '@ngx-translate/core';

// region: third libs
import { CountdownModule } from 'ngx-countdown';
const THIRDMODULES = [ CountdownModule ];
// endregion

// region: your componets & directives
import { ProgressComponent } from '../routes/workplace/launch/progress/progress.component';
import { ReviewProgressComponent } from '../routes/workplace/launch/review-progress/review-progress.component';
import { TreeComponent } from '../routes/component/tree/tree.component';
import { treeNodeComponent } from '../routes/component/tree/tree-node.component';
import { SearchTreeComponent } from '../routes/component/tree/search-tree.component';
import { DialogReviewProgressComponent } from '../layout/default/dialog-review-progress/dialog-review-progress.component';

const COMPONENTS = [
    ProgressComponent,
    ReviewProgressComponent,
    TreeComponent,
    treeNodeComponent,
    SearchTreeComponent,
    DialogReviewProgressComponent,
];
const DIRECTIVES = [];
// endregion

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        PdfViewerModule,
        ReactiveFormsModule,
        ...ZORROMODULES,
        NgZorroAntdExtraModule,
        AlainThemeModule.forChild(),
        ...ABCMODULES,
        AlainACLModule,
        // third libs
        ...THIRDMODULES
    ],
    declarations: [
        // your components
        ...COMPONENTS,
        ...DIRECTIVES
    ],
    exports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        ...ZORROMODULES,
        NgZorroAntdExtraModule,
        AlainThemeModule,
        ...ABCMODULES,
        // i18n
        TranslateModule,
        // third libs
        ...THIRDMODULES,
        // your components
        ...COMPONENTS,
        ...DIRECTIVES
    ]
})
export class SharedModule { }
