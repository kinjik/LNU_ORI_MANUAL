<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ResearchMonitoringFormNotification extends Notification implements ShouldBroadcast
{
    use Queueable;
    
    public $message;
    public $url;
    public $image_path;
    public $name;
    public $intended_role;

    /**
     * Create a new notification instance.
     */
    public function __construct($message, $url, $image_path, $name, $intended_role = null)
    {
        $this->message = $message;
        $this->url = $url;
        $this->image_path = $image_path;
        $this->name= $name;

        if (!$intended_role && $url) {
            $cleanUrl = ltrim($url, '/');
            if (str_starts_with($cleanUrl, 'faculty') || str_starts_with($cleanUrl, 'create')) {
                $intended_role = 'faculty';
            } elseif (str_starts_with($cleanUrl, 'admin')) {
                $intended_role = 'admin';
            } elseif (str_starts_with($cleanUrl, 'research-monitoring-form')) {
                $intended_role = 'research-coordinator';
            }
        }
        $this->intended_role = $intended_role;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database', 'broadcast'];
    }

    /**
     * Get the mail representation of the notification.
     */

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toDatabase(object $notifiable): array
    {
        return [
            'message' => $this->message,
            'url' => $this->url,
            'image_path' => $this->image_path ?? '',
            'name' => $this->name ?? '',
            'intended_role' => $this->intended_role,
            'created_at' => now(),
            'read_at' => null,
        ];
    }
    public function toBroadcast(object $notifiable): BroadcastMessage
    {
        return new BroadcastMessage([
            'message' => $this->message,
            'url' => $this->url,
            'image_path' => $this->image_path ?? '',
            'name' => $this->name ?? '',
            'intended_role' => $this->intended_role,
            'created_at' => now(),
            'read_at' => null,
        ]);
    }
}
