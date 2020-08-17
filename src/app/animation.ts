import { trigger, transition, query, style, stagger, animate } from "@angular/animations";

export const listAnimation = trigger('listAnimation', [
    transition('* => void', [
      query(':enter',
        [style({ opacity: 0 }), stagger('60ms', animate('600ms ease-out', style({ opacity: 1 })))],
        { optional: true }
      ),
      query(':leave',
        animate('200ms', style({ opacity: 0 })),
        { optional: true }
      )
    ])
]);

export const fadeAnimation = trigger('fadeAnimation', [
    transition('* => *', 
      [
        query('.cat-card', stagger(200, 
          [
            style({ opacity: 0 }),
            animate('600ms ease-in', style({ opacity: 1 }))
          ]
        ), { optional: true })
      ]
    ),
    transition(':leave',
    [
      query('.cat-card', stagger(200, 
        [
          style({ opacity: 1 }),
          animate('600ms ease-in', style({ opacity: 0 }))
        ]
      ), { optional: true })
    ]
    )
  ]);