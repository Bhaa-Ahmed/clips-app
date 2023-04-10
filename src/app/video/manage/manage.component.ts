import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import IClip from 'src/app/models/clip.model';
import { ClipService } from 'src/app/services/clip.service';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.css'],
})
export class ManageComponent implements OnInit {
  videoOrder = '1';
  clips: IClip[] = [];
  activeClip: IClip | null = null;
  sort$: BehaviorSubject<string>;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private clipService: ClipService,
    public modal: ModalService
  ) {
    this.sort$ = new BehaviorSubject(this.videoOrder);
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.videoOrder = params['sort'] === '2' ? params['sort'] : '1';
      this.sort$.next(this.videoOrder);
    });

    this.clipService.getUserClips(this.sort$).subscribe((docs) => {
      this.clips = [];

      docs.forEach((doc) => {
        this.clips.push({
          docID: doc.id,
          ...doc.data(),
        });
      });
    });
  }

  sort(e: Event) {
    const { value } = e.target as HTMLSelectElement;
    this.router.navigateByUrl(`/manage?sort=${value}`);
  }

  openModal(e: Event, clip: IClip) {
    e.preventDefault();

    this.activeClip = clip;

    this.modal.toggleModal('editClip');
  }

  update(e: IClip) {
    this.clips.forEach((el, idx) => {
      if (el.docID === e.docID) {
        this.clips[idx].title = e.title;
      }
    });
  }

  deleteClip(e: Event, clip: IClip) {
    e.preventDefault();

    this.clipService.deleteClip(clip);

    this.clips.forEach((el, idx) => {
      if (el.docID === clip.docID) {
        this.clips.splice(idx, 1);
      }
    });
  }

  async copyToClipboard(e: MouseEvent, docID: string | undefined) {
    e.preventDefault();

    if (!docID) return;

    const url = `${location.origin}/clip/${docID}`;

    await navigator.clipboard.writeText(url);

    alert('Link copied!');
  }
}
